package com.nextune.backend.service;

import com.nextune.backend.dto.GenreResponse;
import com.nextune.backend.model.Genre;
import com.nextune.backend.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;
    private final FileStorageService fileStorageService;

    public GenreResponse createGenre(String name, String description, MultipartFile image) {
        if (genreRepository.existsByName(name)) {
            throw new RuntimeException("Genre already exists");
        }

        Genre genre = Genre.builder()
                .name(name)
                .description(description)
                .build();

        if (image != null && !image.isEmpty()) {
            genre.setImageUrl(fileStorageService.storeFile(image, "genres"));
        }

        return mapToResponse(genreRepository.save(genre));
    }

    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GenreResponse getGenreById(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        return mapToResponse(genre);
    }

    public GenreResponse updateGenre(Long id, String name, String description, MultipartFile image) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));

        if (name != null) genre.setName(name);
        if (description != null) genre.setDescription(description);

        if (image != null && !image.isEmpty()) {
            fileStorageService.deleteFile(genre.getImageUrl());
            genre.setImageUrl(fileStorageService.storeFile(image, "genres"));
        }

        return mapToResponse(genreRepository.save(genre));
    }

    public void deleteGenre(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        fileStorageService.deleteFile(genre.getImageUrl());
        genreRepository.delete(genre);
    }

    private GenreResponse mapToResponse(Genre genre) {
        return GenreResponse.builder()
                .id(genre.getId())
                .name(genre.getName())
                .description(genre.getDescription())
                .imageUrl(genre.getImageUrl())
                .build();
    }
}