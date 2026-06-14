package com.nextune.backend.service;

import com.nextune.backend.dto.SongResponse;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikedSongRepository likedSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    public void likeSong(Long userId, Long songId) {
        if (likedSongRepository.existsByUserIdAndSongId(userId, songId)) {
            throw new RuntimeException("Song already liked");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        LikedSong likedSong = LikedSong.builder()
                .user(user)
                .song(song)
                .build();
        likedSongRepository.save(likedSong);

        song.setLikeCount(song.getLikeCount() + 1);
        songRepository.save(song);
    }

    public void unlikeSong(Long userId, Long songId) {
        LikedSong likedSong = likedSongRepository.findByUserIdAndSongId(userId, songId)
                .orElseThrow(() -> new RuntimeException("Song not liked yet"));

        likedSongRepository.delete(likedSong);

        Song song = likedSong.getSong();
        song.setLikeCount(Math.max(0, song.getLikeCount() - 1));
        songRepository.save(song);
    }

    public List<SongResponse> getLikedSongs(Long userId) {
        return likedSongRepository.findByUserIdOrderByLikedAtDesc(userId)
                .stream()
                .map(likedSong -> songService.mapToResponse(likedSong.getSong()))
                .collect(Collectors.toList());
    }

    public boolean isLiked(Long userId, Long songId) {
        return likedSongRepository.existsByUserIdAndSongId(userId, songId);
    }
}