package com.example.group_app_prototype1;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class StocksAdapter extends RecyclerView.Adapter<StocksAdapter.MyViewHolder> {
    String data1[];
    int images[];
    Context context;

    public StocksAdapter(Context cont, String s1[], int img[]){
        context = cont;
        data1 = s1;
        images = img;
    }
    @NonNull
    @Override
    public  StocksAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout. stocks_row, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull StocksAdapter.MyViewHolder holder, int position) {
        holder.myTxt1.setText(data1[position]);
        holder.myImage.setImageResource(images[position]);
    }

    @Override
    public int getItemCount() {
        return data1.length;
    }


    public class MyViewHolder extends RecyclerView.ViewHolder{
        TextView myTxt1;
        ImageView myImage;

        public MyViewHolder(final View itemView) {
            super(itemView);
            myTxt1 = itemView.findViewById(R.id.stock_name_txt);
            myImage = itemView.findViewById(R.id.stockImage);
        }
    }
}
