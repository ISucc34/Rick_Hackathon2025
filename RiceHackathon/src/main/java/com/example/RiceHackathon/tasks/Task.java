package com.example.RiceHackathon.tasks;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String year;
    private String month;
    private String day;
    
    public Task() {
    }

    public Task( String title, String year, String month, String day) {
        
        this.title = title;
        this.year = year;
        this.month = month;
        this.day = day;
    }
    
    
}
