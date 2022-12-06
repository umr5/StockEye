package com.example.group_app_prototype1;

import java.lang.reflect.Array;
import java.util.Date;

public class Stock {

    String Array, Date, Name, Value;

    public Stock(){}


    public Stock(String Array, String Date, String Name, String Value) {
        this.Array = Array;
        this.Date = Date;
        this.Name = Name;
        this.Value = Value;

    }

    public String getArray() {
        return Array;
    }

    public void setArray(String Array) {
        this.Array = Array;
    }

    public String getDate() {
        return Date;
    }

    public void setDate(String Date) {
        this.Date = Date;
    }

    public String getName() {
        return Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public String getValue() {
        return Value;
    }

    public void setValue(String Value) {
        this.Value = Value;
    }

}
