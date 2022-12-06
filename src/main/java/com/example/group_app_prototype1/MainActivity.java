package com.example.group_app_prototype1;

import androidx.annotation.Nullable;
import androidx.annotation.Size;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.material.tabs.TabLayout;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

// TODO:
//  1. Add sign out
//  2. Display stocks in json format
//  3. Display stocks in recyclerview
//  4. Display stocks via graph
//  5. Add invest and sell buttons and functionality
//  6. Add accounts page
//  7. Implement chat-bot

public class MainActivity extends AppCompatActivity {

    Button login_btn, register_btn;
    TabLayout tab;
    TabLayout.Tab home_btn, account_btn, help_btn, review_btn;
    RecyclerView recyclerView;
    ArrayList<Stock> stockArrayList;
    FirebaseFirestore db;
    MyAdapter myAdapter;
    ProgressDialog progressDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        progressDialog = new ProgressDialog(this);
        progressDialog.setCancelable(false);
        progressDialog.setMessage("Fetching data...");
        progressDialog.show();

        login_btn = (Button) findViewById(R.id.Log_in_btn1);
        register_btn = (Button) findViewById(R.id.Register_btn1);
        tab = (TabLayout) findViewById(R.id.Nav_bar);

        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        db = FirebaseFirestore.getInstance();
        stockArrayList = new ArrayList<Stock>();
        myAdapter = new MyAdapter(MainActivity.this, stockArrayList);

        recyclerView.setAdapter(myAdapter);

        EventChangeListener();

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
    }

    private void EventChangeListener() {

        // NOTE: Change to Stocks
        db.collection("User_Traders")
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                        if (error != null){

                            if (progressDialog.isShowing()){
                                progressDialog.dismiss();
                            }

                            Toast.makeText(MainActivity.this, "Firestore Error", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        for (DocumentChange dc : value.getDocumentChanges()){

                            if (dc.getType() == DocumentChange.Type.ADDED){
                                stockArrayList.add(dc.getDocument().toObject(Stock.class));

                            }

                            myAdapter.notifyDataSetChanged();
                            if (progressDialog.isShowing()){
                                progressDialog.dismiss();
                            }
                        }
                    }
                });
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
