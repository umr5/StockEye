package com.example.group_app_prototype1;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {

    Context context;
    ArrayList<Stock> stockArrayList;

    public MyAdapter(Context context, ArrayList<Stock> stockArrayList) {
        this.context = context;
        this.stockArrayList = stockArrayList;
    }

    @NonNull
    @Override
    public MyAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View v = LayoutInflater.from(context).inflate(R.layout.stocks_row,parent,false);
        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull MyAdapter.MyViewHolder holder, int position) {

        Stock stock = stockArrayList.get(position);

        holder.Array.setText(stock.Array);
        holder.Date.setText(stock.Date);
        holder.Name.setText(stock.Name);
        holder.Value.setText(stock.Value);

        // holder.age.setText(String.valueOf(user.age);     if value is not string


    }

    @Override
    public int getItemCount() {
        return stockArrayList.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        TextView Array, Date, Name, Value;
        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            Array = itemView.findViewById(R.id.tvArray);
            Date = itemView.findViewById(R.id.tvDate);
            Name = itemView.findViewById(R.id.tvName);
            Value = itemView.findViewById(R.id.tvValue);


        }
    }
}
