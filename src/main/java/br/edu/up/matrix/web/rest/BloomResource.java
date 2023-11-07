package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.Bloom;
import br.edu.up.matrix.repository.BloomRepository;
import br.edu.up.matrix.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.edu.up.matrix.domain.Bloom}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BloomResource {

    private final Logger log = LoggerFactory.getLogger(BloomResource.class);

    private static final String ENTITY_NAME = "bloom";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloomRepository bloomRepository;

    public BloomResource(BloomRepository bloomRepository) {
        this.bloomRepository = bloomRepository;
    }

    /**
     * {@code POST  /blooms} : Create a new bloom.
     *
     * @param bloom the bloom to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloom, or with status {@code 400 (Bad Request)} if the bloom has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/blooms")
    public ResponseEntity<Bloom> createBloom(@RequestBody Bloom bloom) throws URISyntaxException {
        log.debug("REST request to save Bloom : {}", bloom);
        if (bloom.getId() != null) {
            throw new BadRequestAlertException("A new bloom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bloom result = bloomRepository.save(bloom);
        return ResponseEntity
            .created(new URI("/api/blooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /blooms/:id} : Updates an existing bloom.
     *
     * @param id the id of the bloom to save.
     * @param bloom the bloom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloom,
     * or with status {@code 400 (Bad Request)} if the bloom is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bloom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/blooms/{id}")
    public ResponseEntity<Bloom> updateBloom(@PathVariable(value = "id", required = false) final Integer id, @RequestBody Bloom bloom)
        throws URISyntaxException {
        log.debug("REST request to update Bloom : {}, {}", id, bloom);
        if (bloom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bloomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bloom result = bloomRepository.save(bloom);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloom.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /blooms/:id} : Partial updates given fields of an existing bloom, field will ignore if it is null
     *
     * @param id the id of the bloom to save.
     * @param bloom the bloom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloom,
     * or with status {@code 400 (Bad Request)} if the bloom is not valid,
     * or with status {@code 404 (Not Found)} if the bloom is not found,
     * or with status {@code 500 (Internal Server Error)} if the bloom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/blooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bloom> partialUpdateBloom(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Bloom bloom
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bloom partially : {}, {}", id, bloom);
        if (bloom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bloomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bloom> result = bloomRepository
            .findById(bloom.getId())
            .map(existingBloom -> {
                if (bloom.getNivel() != null) {
                    existingBloom.setNivel(bloom.getNivel());
                }

                return existingBloom;
            })
            .map(bloomRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloom.getId().toString())
        );
    }

    /**
     * {@code GET  /blooms} : get all the blooms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blooms in body.
     */
    @GetMapping("/blooms")
    public List<Bloom> getAllBlooms() {
        log.debug("REST request to get all Blooms");
        return bloomRepository.findAll();
    }

    /**
     * {@code GET  /blooms/:id} : get the "id" bloom.
     *
     * @param id the id of the bloom to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bloom, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/blooms/{id}")
    public ResponseEntity<Bloom> getBloom(@PathVariable Integer id) {
        log.debug("REST request to get Bloom : {}", id);
        Optional<Bloom> bloom = bloomRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bloom);
    }

    /**
     * {@code DELETE  /blooms/:id} : delete the "id" bloom.
     *
     * @param id the id of the bloom to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/blooms/{id}")
    public ResponseEntity<Void> deleteBloom(@PathVariable Integer id) {
        log.debug("REST request to delete Bloom : {}", id);
        bloomRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
