package com.example.group_app_prototype1;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class RegisterActivity extends AppCompatActivity {
    public static final String TAG = "TAG";
    EditText mFullName, mEmail, mPassword, mConfirmPassword;
    Button mRegister_btn, back_btn;
    FirebaseAuth fAuth;
    ProgressBar progressBar;
    FirebaseFirestore db;
    FirebaseUser fUser;
    Button broker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register2);

        mFullName = findViewById(R.id.FullName);
        mEmail = findViewById(R.id.Email);
        mPassword = findViewById(R.id.Password);
        mConfirmPassword = findViewById(R.id.Confirm_password);
        mRegister_btn = findViewById(R.id.Create_btn);
        broker = findViewById(R.id.brokerbtn);

        fAuth = FirebaseAuth.getInstance();
        fUser = fAuth.getCurrentUser();
        db = FirebaseFirestore.getInstance();
        progressBar = findViewById(R.id.ProgressBar);

//        if(fAuth.getCurrentUser() != null){
//            startActivity(new Intent(getApplicationContext(), LoginActivity.class));
//        }

        mRegister_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String fullname = mFullName.getText().toString().trim();
                String email = mEmail.getText().toString().trim();
                String password = mPassword.getText().toString().trim();
                String confirm_password = mConfirmPassword.getText().toString().trim();

                if (TextUtils.isEmpty(fullname)) {
                    mFullName.setError("Full Name is required.");
                    mFullName.requestFocus();
                    return;
                }

                if (TextUtils.isEmpty(email)) {
                    mEmail.setError("Email is required.");
                    mEmail.requestFocus();
                    return;
                }

                if (TextUtils.isEmpty(password)) {
                    mPassword.setError("Password is required.");
                    mPassword.requestFocus();
                    return;
                }

                if (password.length() < 6) {
                    mPassword.setError("Must have a minimum of 6 characters.");
                    mPassword.requestFocus();
                    return;
                }

                else if(!password.equals(confirm_password)){
                    mConfirmPassword.setError("Passwords do not match");
                    mConfirmPassword.requestFocus();
                }

                progressBar.setVisibility(View.VISIBLE);

                // Trying something
                fAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()){
                            progressBar.setVisibility(View.INVISIBLE);
                            Toast.makeText(RegisterActivity.this, "Successfully registered", Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(RegisterActivity.this, MainActivity.class);
                                startActivity(intent);
                        }
                    }
                });
                Map<String, Object> user = new HashMap<>();
                user.put("account", "Direct User");
                user.put("email", email);
                user.put("username", fullname);

                db.collection("User_Traders")
                        .add(user)
                        .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                            @Override
                            public void onSuccess(DocumentReference documentReference) {
                                Toast.makeText(RegisterActivity.this, "Success", Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent(RegisterActivity.this, MainActivity.class);
                                startActivity(intent);
                            }
                        }).addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(RegisterActivity.this, "Failed", Toast.LENGTH_SHORT).show();
                            }
                        });
            }
        });
        broker.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(RegisterActivity.this, RegisterBrokerActivity.class);
                startActivity(intent);
            }
        });
    }
}
