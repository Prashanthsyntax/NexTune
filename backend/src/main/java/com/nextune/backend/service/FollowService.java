package com.nextune.backend.service;

import com.nextune.backend.dto.ArtistResponse;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final ArtistService artistService;

    public void followArtist(Long userId, Long artistId) {
        if (followRepository.existsByUserIdAndArtistId(userId, artistId)) {
            throw new RuntimeException("Already following this artist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        Follow follow = Follow.builder()
                .user(user)
                .artist(artist)
                .build();
        followRepository.save(follow);

        artist.setFollowers(artist.getFollowers() + 1);
        artistRepository.save(artist);
    }

    public void unfollowArtist(Long userId, Long artistId) {
        Follow follow = followRepository.findByUserIdAndArtistId(userId, artistId)
                .orElseThrow(() -> new RuntimeException("You are not following this artist"));

        followRepository.delete(follow);

        Artist artist = follow.getArtist();
        artist.setFollowers(Math.max(0, artist.getFollowers() - 1));
        artistRepository.save(artist);
    }

    public List<ArtistResponse> getFollowedArtists(Long userId) {
        return followRepository.findByUserId(userId)
                .stream()
                .map(follow -> artistService.mapToResponse(follow.getArtist()))
                .collect(Collectors.toList());
    }

    public boolean isFollowing(Long userId, Long artistId) {
        return followRepository.existsByUserIdAndArtistId(userId, artistId);
    }
}