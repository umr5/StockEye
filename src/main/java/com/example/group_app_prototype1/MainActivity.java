package com.example.group_app_prototype1;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.Size;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

//import com.google.android.material.tabs.TabLayout;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    Button login_btn, register_btn, logOut_btn;
    RecyclerView recyclerView;
    ArrayList<Stock> stockArrayList;
    FirebaseFirestore db;
    FirebaseUser firebaseUser;
    FirebaseAuth firebaseAuth;
    MyAdapter myAdapter;
    ProgressDialog progressDialog;
    BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bottomNavigationView = findViewById(R.id.Nav_bar);
        bottomNavigationView.setSelectedItemId(R.id.Home);
        bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {

                    case R.id.Account:
                        startActivity(new Intent(getApplicationContext(), AccountActivity.class));
                        overridePendingTransition(0, 0);
                        return true;
                    case R.id.Brokers:
                        startActivity(new Intent(getApplicationContext(), BrokersActivity.class));
                        overridePendingTransition(0, 0);
                    case R.id.Support:
                        startActivity(new Intent(getApplicationContext(), SupportActivity.class));
                        overridePendingTransition(0, 0);
                        return true;
                    case R.id.Home:
                        return true;
                }

                return false;
            }
        });

//        progressDialog = new ProgressDialog(this);
//        progressDialog.setCancelable(false);
//        progressDialog.setMessage("Fetching data...");
//        progressDialog.show();
//        logOut_btn.setVisibility(View.INVISIBLE);

        login_btn = (Button) findViewById(R.id.log_in_btn);
        register_btn = (Button) findViewById(R.id.Register_btn1);
//        tab = (TabLayout) findViewById(R.id.Nav_bar);

        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        firebaseAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
        stockArrayList = new ArrayList<Stock>();
        myAdapter = new MyAdapter(MainActivity.this, stockArrayList);
        recyclerView.setAdapter(myAdapter);

        Toast.makeText(MainActivity.this, "Before Listener", Toast.LENGTH_SHORT).show();
        EventChangeListener();
        Toast.makeText(MainActivity.this, "After Listener", Toast.LENGTH_SHORT).show();

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

//    @Override
//    protected void onStart() {
//        super.onStart();

//
//        firebaseUser = firebaseAuth.getCurrentUser();
//        if (firebaseUser != null){
//        // If there is someone logged in
//        Toast.makeText(MainActivity.this, firebaseUser+" is logged in", Toast.LENGTH_SHORT).show();
//            login_btn.setVisibility(View.INVISIBLE);
//            register_btn.setVisibility(View.INVISIBLE);
//    }   else{
//            Toast.makeText(MainActivity.this, "No-one is logged in", Toast.LENGTH_SHORT).show();
//            logOut_btn.setVisibility(View.INVISIBLE);
//
//        }
//    }

    private void EventChangeListener() {

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
                            Toast.makeText(MainActivity.this, "Doc change", Toast.LENGTH_SHORT).show();

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
//    public void logout(View view) {
//        firebaseAuth.signOut();
//        if (firebaseUser != null){
//            // If there is someone logged in
//            Toast.makeText(MainActivity.this, firebaseUser+" is logged in", Toast.LENGTH_SHORT).show();
//            login_btn.setVisibility(View.INVISIBLE);
//            register_btn.setVisibility(View.INVISIBLE);
//        }   else{
//            Toast.makeText(MainActivity.this, "No-one is logged in", Toast.LENGTH_SHORT).show();
//            logOut_btn.setVisibility(View.INVISIBLE);
//
//        }
//    }
}
