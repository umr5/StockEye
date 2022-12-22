package com.example.group_app_prototype1;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Stock {

    String Name, account;
    int Array, Date, Value;


    public Stock() {
    }

    public Stock(String account, String name, int array, int value) {
        account = account;
        Name = name;
        Array = array;
        Value = value;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        account = account;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public int getArray() {
        return Array;
    }

    public void setArray(int array) {
        Array = array;
    }

    public int getValue() {
        return Value;
    }

    public void setValue(int value) {
        Value = value;
    }
}


