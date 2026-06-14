package com.nextune.backend.service;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;
    private final FileStorageService fileStorageService;
    private final SongService songService;

    public AlbumResponse createAlbum(Long userId, String title, String description,
                                      String albumType, LocalDate releaseDate,
                                      MultipartFile coverImage) {
        Artist artist = artistRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Artist profile not found"));

        Album album = Album.builder()
                .title(title)
                .artist(artist)
                .description(description)
                .releaseDate(releaseDate)
                .albumType(Album.AlbumType.valueOf(albumType.toUpperCase()))
                .build();

        if (coverImage != null && !coverImage.isEmpty()) {
            album.setCoverImage(
                fileStorageService.storeFile(coverImage, "albums/covers"));
        }

        return mapToResponse(albumRepository.save(album));
    }

    public AlbumResponse getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));
        return mapToResponseWithSongs(album);
    }

    public List<AlbumResponse> getAlbumsByArtist(Long artistId) {
        return albumRepository.findByArtistId(artistId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AlbumResponse> getAllAlbums() {
        return albumRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AlbumResponse mapToResponse(Album album) {
        return AlbumResponse.builder()
                .id(album.getId())
                .title(album.getTitle())
                .artistName(album.getArtist().getArtistName())
                .artistId(album.getArtist().getId())
                .coverImage(album.getCoverImage())
                .releaseDate(album.getReleaseDate())
                .description(album.getDescription())
                .albumType(album.getAlbumType().name())
                .createdAt(album.getCreatedAt())
                .build();
    }

    private AlbumResponse mapToResponseWithSongs(Album album) {
        AlbumResponse response = mapToResponse(album);
        List<SongResponse> songs = songRepository.findByAlbumId(album.getId())
                .stream().map(songService::mapToResponse)
                .collect(Collectors.toList());
        response.setSongs(songs);
        return response;
    }
}