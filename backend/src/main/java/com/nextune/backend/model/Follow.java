package com.nextune.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "artist_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @Column(updatable = false)
    private LocalDateTime followedAt;

    @PrePersist
    protected void onCreate() {
        followedAt = LocalDateTime.now();
    }
}