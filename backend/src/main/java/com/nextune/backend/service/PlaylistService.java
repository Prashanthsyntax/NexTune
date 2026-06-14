package com.nextune.backend.service;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final FileStorageService fileStorageService;
    private final SongService songService;

    public PlaylistResponse createPlaylist(Long userId, String name, String description,
                                            boolean isPublic, MultipartFile coverImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Playlist playlist = Playlist.builder()
                .name(name)
                .description(description)
                .isPublic(isPublic)
                .user(user)
                .build();

        if (coverImage != null && !coverImage.isEmpty()) {
            playlist.setCoverImage(fileStorageService.storeFile(coverImage, "playlists/covers"));
        }

        return mapToResponse(playlistRepository.save(playlist));
    }

    public PlaylistResponse getPlaylistById(Long id, Long requesterId) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        boolean isOwner = requesterId != null && playlist.getUser().getId().equals(requesterId);

        if (!playlist.isPublic() && !isOwner) {
            throw new RuntimeException("This playlist is private");
        }

        return mapToResponseWithSongs(playlist);
    }

    public List<PlaylistResponse> getUserPlaylists(Long userId) {
        return playlistRepository.findByUserId(userId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PlaylistResponse> getPublicPlaylists() {
        return playlistRepository.findByIsPublicTrue()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PlaylistResponse updatePlaylist(Long playlistId, Long userId, String name,
                                           String description, Boolean isPublic,
                                           MultipartFile coverImage) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't own this playlist");
        }

        if (name != null) playlist.setName(name);
        if (description != null) playlist.setDescription(description);
        if (isPublic != null) playlist.setPublic(isPublic);

        if (coverImage != null && !coverImage.isEmpty()) {
            fileStorageService.deleteFile(playlist.getCoverImage());
            playlist.setCoverImage(fileStorageService.storeFile(coverImage, "playlists/covers"));
        }

        return mapToResponse(playlistRepository.save(playlist));
    }

    public void deletePlaylist(Long playlistId, Long userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't own this playlist");
        }

        fileStorageService.deleteFile(playlist.getCoverImage());
        playlistRepository.delete(playlist);
    }

    public PlaylistResponse addSong(Long playlistId, Long userId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't own this playlist");
        }

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        if (playlist.getSongs().contains(song)) {
            throw new RuntimeException("Song already in playlist");
        }

        playlist.getSongs().add(song);
        return mapToResponseWithSongs(playlistRepository.save(playlist));
    }

    public PlaylistResponse removeSong(Long playlistId, Long userId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't own this playlist");
        }

        playlist.getSongs().removeIf(song -> song.getId().equals(songId));
        return mapToResponseWithSongs(playlistRepository.save(playlist));
    }

    private PlaylistResponse mapToResponse(Playlist playlist) {
        return PlaylistResponse.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .description(playlist.getDescription())
                .coverImage(playlist.getCoverImage())
                .isPublic(playlist.isPublic())
                .userId(playlist.getUser().getId())
                .username(playlist.getUser().getUsername())
                .songCount(playlist.getSongs().size())
                .createdAt(playlist.getCreatedAt())
                .updatedAt(playlist.getUpdatedAt())
                .build();
    }

    private PlaylistResponse mapToResponseWithSongs(Playlist playlist) {
        PlaylistResponse response = mapToResponse(playlist);
        response.setSongs(playlist.getSongs().stream()
                .map(songService::mapToResponse)
                .collect(Collectors.toList()));
        return response;
    }
}