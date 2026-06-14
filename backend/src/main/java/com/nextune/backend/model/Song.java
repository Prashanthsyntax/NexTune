package com.nextune.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @Column(nullable = false)
    private String audioUrl;

    private String coverImage;
    private Integer duration;

    @Builder.Default
    private Long playCount = 0L;

    @Builder.Default
    private Long likeCount = 0L;

    @Builder.Default
    private boolean premium = false;

    @Builder.Default
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SongStatus status = SongStatus.PENDING;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SongStatus {
        PENDING, APPROVED, REJECTED
    }
}