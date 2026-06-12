package com.nextune.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "listening_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(updatable = false)
    private LocalDateTime playedAt;

    @PrePersist
    protected void onCreate() {
        playedAt = LocalDateTime.now();
    }
}