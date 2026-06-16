package com.nextune.backend.service;

import com.nextune.backend.dto.UserProfileResponse;
import com.nextune.backend.model.User;
import com.nextune.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public UserProfileResponse updateProfile(String email, String username, String bio,
                                              MultipartFile profileImage) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (username != null && !username.equals(user.getUsername())) {
            if (userRepository.existsByUsername(username)) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(username);
        }

        if (bio != null) user.setBio(bio);

        if (profileImage != null && !profileImage.isEmpty()) {
            fileStorageService.deleteFile(user.getProfileImage());
            user.setProfileImage(fileStorageService.storeFile(profileImage, "users/profile"));
        }

        return mapToResponse(userRepository.save(user));
    }

    public UserProfileResponse togglePremium(String email, boolean premium) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPremium(premium);
        return mapToResponse(userRepository.save(user));
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .premium(user.isPremium())
                .createdAt(user.getCreatedAt())
                .build();
    }
}