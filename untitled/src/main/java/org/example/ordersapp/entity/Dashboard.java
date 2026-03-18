package org.example.ordersapp.entity;

import jakarta.persistence.*;

@Entity
public class Dashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String layout; // stores JSON of dashboard widgets

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLayout() { return layout; }
    public void setLayout(String layout) { this.layout = layout; }
}