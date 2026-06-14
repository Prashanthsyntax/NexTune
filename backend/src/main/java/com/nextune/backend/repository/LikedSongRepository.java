package com.nextune.backend.repository;

import com.nextune.backend.model.LikedSong;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikedSongRepository extends JpaRepository<LikedSong, Long> {
    Optional<LikedSong> findByUserIdAndSongId(Long userId, Long songId);
    List<LikedSong> findByUserIdOrderByLikedAtDesc(Long userId);
    boolean existsByUserIdAndSongId(Long userId, Long songId);
}