package com.example.group_app_prototype1;

import static com.example.group_app_prototype1.RegisterActivity.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;
import java.util.Map;

public class SupportActivity extends AppCompatActivity {
    private EditText nameEditText;
    private EditText emailEditText;
    private EditText messageEditText;
    private Button submitButton;
    private FirebaseDatabase firebaseDatabase;
    private DatabaseReference databaseReference;
    private BottomNavigationView bottomNavigationView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_support);

        nameEditText = findViewById(R.id.name_edit_text);
        emailEditText = findViewById(R.id.email_edit_text);
        messageEditText = findViewById(R.id.message_edit_text);
        submitButton = findViewById(R.id.submit_btn);

        bottomNavigationView = findViewById(R.id.Nav_bar);
        bottomNavigationView.setSelectedItemId(R.id.Account);

        bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {

                    case R.id.Home:
                        startActivity(new Intent(getApplicationContext(), MainActivity.class));
                        overridePendingTransition(0, 0);
                        return true;
                    case R.id.Brokers:
                        startActivity(new Intent(getApplicationContext(), BrokersActivity.class));
                        overridePendingTransition(0, 0);
                        return true;
                    case R.id.Account:
                        startActivity(new Intent(getApplicationContext(), SupportActivity.class));
                        overridePendingTransition(0, 0);
                        return true;
                    case R.id.Support:
                        return true;
                }
                return false;
            }
        });


        firebaseDatabase = FirebaseDatabase.getInstance();
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String name = nameEditText.getText().toString();
                String email = emailEditText.getText().toString();
                String message = messageEditText.getText().toString();
                FirebaseFirestore db = FirebaseFirestore.getInstance();

                Map<String, Object> data = new HashMap<>();

// Add the form data to the map
                data.put("name", name);
                data.put("email", email);
                data.put("message", message);

// Use the Firestore API to add the data to the database
                db.collection("messages").add(data)
                        .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                            @Override
                            public void onSuccess(DocumentReference documentReference) {
                                Log.d(TAG, "DocumentSnapshot added with ID: " + documentReference.getId());
                                Toast.makeText(SupportActivity.this, "Your support request has been sent!", Toast.LENGTH_SHORT).show();

                            }
                        })
                        .addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Log.w(TAG, "Error adding document", e);
                                Toast.makeText(SupportActivity.this, "Error", Toast.LENGTH_SHORT).show();

                            }
                        });
            }
        });
    }
}

