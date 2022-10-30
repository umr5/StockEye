import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.python.keras import Sequential
from keras.layers import Dense, LSTM, Dropout
from keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, TensorBoard

datasetAMZN = 'datasets/AMZN Historical Data.csv'
datasetFB = 'datasets/FB Historical Data.csv'
datasetGOOG = 'datasets/GOOG Historical Data.csv'
datasetsNFLX = 'datasets/NFLX Historical Data.csv'
data = pd.read_csv(datasetAMZN)
data['Date'] = pd.to_datetime(data['Date'])
data.set_index('Date')
data = data[data['Date'].between('2020-01-01', '2022-01-01')]

scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform((data['Close']).values.reshape(-1, 1))

prediction_days = 60

x_train = []
y_train = []

for x in range(prediction_days, len(scaled_data)):
    x_train.append(scaled_data[x - prediction_days:x, 0])
    y_train.append(scaled_data[x, 0])

x_train, y_train = np.array(x_train), np.array(y_train)
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

model = Sequential()
model.add(LSTM(units=20, return_sequences=True, input_shape=(x_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(units=20, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=20))
model.add(Dropout(0.2))
model.add(Dense(units=1))

model.compile(optimizer='adam', loss='mean_squared_error')
####
es = EarlyStopping(monitor='val_loss', min_delta=1e-10, patience=10, verbose=1)
rlr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=10, verbose=1)
mcp = ModelCheckpoint(filepath='weights.h5', monitor='val_loss', verbose=1, save_best_only=True, save_weights_only=True)
tb = TensorBoard('logs')
###
#Shuffle, callbacks, validationsplit, verbose
model.fit(x_train, y_train, shuffle=True, epochs=25, callbacks=[es, rlr, mcp, tb], validation_split=0.2, verbose=1, batch_size=32)
######


test_data = pd.read_csv(datasetAMZN)
data['Date'] = pd.to_datetime(data['Date'])
data.set_index('Date')
data = data[data['Date'].between('2020-01-01', '2022-09-14')]

total_dataset = pd.concat((data['Close'], test_data['Close']), axis=0)
model_inputs = total_dataset[len(total_dataset) - len(test_data) - prediction_days:].values
model_inputs = model_inputs.reshape(-1, 1)
model_inputs = scaler.transform(model_inputs)

stock_data = np.empty((0,1))
for i in range(10):
    real_data = [model_inputs[len(test_data) + 1 - prediction_days: len(model_inputs+1)-i, 0]]

    real_data = np.array(real_data)
    real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))
    prediction = model.predict(real_data)
    prediction = scaler.inverse_transform(prediction)
    stock_data = np.concatenate([stock_data, prediction])

x = stock_data.flatten()
stock_prediction = list(x)
print(stock_prediction, type(stock_prediction))
