package com.example.group_app_prototype1;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;

import com.google.android.material.tabs.TabLayout;

public class MainActivity extends AppCompatActivity {

    Button login_btn, register_btn;
    TabLayout tab;
    TabLayout.Tab home_btn, account_btn, help_btn, review_btn;
    RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        login_btn = (Button) findViewById(R.id.Log_in_btn1);
        register_btn = (Button) findViewById(R.id.Register_btn1);
        tab = (TabLayout) findViewById(R.id.Nav_bar);

        recyclerView = (RecyclerView) findViewById(R.id.stocks_rv);

        String s1[];
        int images[] = {R.drawable.stock_example, R.drawable.stock_example, R.drawable.stock_example, R.drawable.stock_example};

        recyclerView = findViewById(R.id.stocks_rv);
        s1 = getResources().getStringArray(R.array.Stocks);

        StocksAdapter myAdapter = new StocksAdapter(this, s1, images);
        recyclerView.setAdapter(myAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));


        login_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openLogin();
            }
        });

        register_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openRegister();
            }
        });

//        home_btn.setOnClickListener(new View.OnHoverListener() {
//            @Override
//            public boolean onHover(View view, MotionEvent motionEvent) {
//                return false;
//            }
//        });

    }
    public void openLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }
    public void openRegister() {
        Intent intent = new Intent(this, RegisterActivity.class);
        startActivity(intent);
    }
}
