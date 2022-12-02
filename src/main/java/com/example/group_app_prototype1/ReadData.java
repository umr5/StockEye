package com.example.group_app_prototype1;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Switch;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class ReadData extends AppCompatActivity {

    Button read;
    FirebaseFirestore db;
    Switch accountType;
    String switchstatus = "";
    static final String TAG = "Read Data Activity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_data);
        db = FirebaseFirestore.getInstance();
        read = findViewById(R.id.readbtn);
        accountType = findViewById(R.id.accountType);

        accountType.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(accountType.isChecked()){

                    switchstatus = "broker";
                    Toast.makeText(ReadData.this, "Broker account",Toast.LENGTH_SHORT).show();
                }else {
                    switchstatus = "standard";
                    Toast.makeText(ReadData.this, "Standard account",Toast.LENGTH_SHORT).show();
                }
            }
        });
        read.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(accountType.isChecked()){

                    switchstatus = "broker";
                }else {
                    switchstatus = "standard";
                }

                db.collection("user")
                        .whereEqualTo("Account", switchstatus)
                        .get()
                        .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<QuerySnapshot> task) {

                                if (task.isSuccessful()){

                                    Toast.makeText(ReadData.this, "Success",Toast.LENGTH_SHORT).show();

                                    for(QueryDocumentSnapshot document : task.getResult()){

                                        Log.d(TAG, document.getId() + "=>" +document.getData());
//                                        String fullName = document.get("Full name").toString();
                                    }

                                }else{

                                    Toast.makeText(ReadData.this, "Failed",Toast.LENGTH_SHORT).show();


                                }
                            }
                        });
            }
        });
    }
}