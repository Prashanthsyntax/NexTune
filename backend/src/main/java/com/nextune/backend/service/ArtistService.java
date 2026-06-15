package com.nextune.backend.service;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import com.nextune.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final JwtUtil jwtUtil;

    public ArtistProfileResponse createArtistProfile(Long userId, String artistName,
                                               String bio, MultipartFile profileImage,
                                               MultipartFile coverImage) {
        if (artistRepository.existsByUserId(userId)) {
            throw new RuntimeException("Artist profile already exists");
        }
        if (artistRepository.existsByArtistName(artistName)) {
            throw new RuntimeException("Artist name already taken");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.ARTIST);
        userRepository.save(user);

        Artist artist = Artist.builder()
                .user(user)
                .artistName(artistName)
                .bio(bio)
                .build();

        if (profileImage != null && !profileImage.isEmpty()) {
            artist.setProfileImage(fileStorageService.storeFile(profileImage, "artists/profile"));
        }
        if (coverImage != null && !coverImage.isEmpty()) {
            artist.setCoverImage(fileStorageService.storeFile(coverImage, "artists/cover"));
        }

        Artist saved = artistRepository.save(artist);

        String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return ArtistProfileResponse.builder()
                .artist(mapToResponse(saved))
                .token(newToken)
                .build();
    }

    public ArtistResponse getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        return mapToResponse(artist);
    }

    public ArtistResponse getArtistByUserId(Long userId) {
        Artist artist = artistRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Artist profile not found"));
        return mapToResponse(artist);
    }

    public List<ArtistResponse> getAllArtists() {
        return artistRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ArtistResponse updateArtist(Long artistId, String bio,
                                        MultipartFile profileImage,
                                        MultipartFile coverImage) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        if (bio != null) artist.setBio(bio);

        if (profileImage != null && !profileImage.isEmpty()) {
            fileStorageService.deleteFile(artist.getProfileImage());
            artist.setProfileImage(
                fileStorageService.storeFile(profileImage, "artists/profile"));
        }
        if (coverImage != null && !coverImage.isEmpty()) {
            fileStorageService.deleteFile(artist.getCoverImage());
            artist.setCoverImage(
                fileStorageService.storeFile(coverImage, "artists/cover"));
        }

        return mapToResponse(artistRepository.save(artist));
    }

    public ArtistResponse mapToResponse(Artist artist) {
        return ArtistResponse.builder()
                .id(artist.getId())
                .userId(artist.getUser().getId())
                .artistName(artist.getArtistName())
                .bio(artist.getBio())
                .profileImage(artist.getProfileImage())
                .coverImage(artist.getCoverImage())
                .followers(artist.getFollowers())
                .verified(artist.isVerified())
                .createdAt(artist.getCreatedAt())
                .build();
    }
}