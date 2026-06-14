package com.nextune.backend.service;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final GenreRepository genreRepository;
    private final FileStorageService fileStorageService;

    public SongResponse uploadSong(Long userId, String title, Long albumId,
                                    Long genreId, boolean premium,
                                    MultipartFile audioFile,
                                    MultipartFile coverImage) {
        Artist artist = artistRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Artist profile not found"));

        Song song = Song.builder()
                .title(title)
                .artist(artist)
                .premium(premium)
                .status(Song.SongStatus.PENDING)
                .build();

        if (albumId != null) {
            albumRepository.findById(albumId).ifPresent(song::setAlbum);
        }
        if (genreId != null) {
            genreRepository.findById(genreId).ifPresent(song::setGenre);
        }

        if (audioFile != null && !audioFile.isEmpty()) {
            song.setAudioUrl(fileStorageService.storeFile(audioFile, "songs/audio"));
        } else {
            throw new RuntimeException("Audio file is required");
        }

        if (coverImage != null && !coverImage.isEmpty()) {
            song.setCoverImage(fileStorageService.storeFile(coverImage, "songs/covers"));
        }

        return mapToResponse(songRepository.save(song));
    }

    public SongResponse getSongById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        return mapToResponse(song);
    }

    public Page<SongResponse> searchSongs(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return songRepository.searchSongs(query, pageable)
                .map(this::mapToResponse);
    }

    public List<SongResponse> getTopSongs(int limit) {
        return songRepository.findTopSongs(PageRequest.of(0, limit))
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> getLatestSongs(int limit) {
        return songRepository.findLatestSongs(PageRequest.of(0, limit))
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> getSongsByArtist(Long artistId) {
        return songRepository.findByArtistId(artistId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> getSongsByAlbum(Long albumId) {
        return songRepository.findByAlbumId(albumId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void incrementPlayCount(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);
    }

    public SongResponse approveSong(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setStatus(Song.SongStatus.APPROVED);
        return mapToResponse(songRepository.save(song));
    }

    public SongResponse rejectSong(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setStatus(Song.SongStatus.REJECTED);
        return mapToResponse(songRepository.save(song));
    }

    public void deleteSong(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        fileStorageService.deleteFile(song.getAudioUrl());
        fileStorageService.deleteFile(song.getCoverImage());
        songRepository.delete(song);
    }

    public SongResponse mapToResponse(Song song) {
        return SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artistName(song.getArtist().getArtistName())
                .artistId(song.getArtist().getId())
                .albumTitle(song.getAlbum() != null ? song.getAlbum().getTitle() : null)
                .albumId(song.getAlbum() != null ? song.getAlbum().getId() : null)
                .genre(song.getGenre() != null ? song.getGenre().getName() : null)
                .audioUrl(song.getAudioUrl())
                .coverImage(song.getCoverImage())
                .duration(song.getDuration())
                .playCount(song.getPlayCount())
                .likeCount(song.getLikeCount())
                .premium(song.isPremium())
                .status(song.getStatus().name())
                .createdAt(song.getCreatedAt())
                .build();
    }
}