package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.Matriz;
import br.edu.up.matrix.repository.MatrizRepository;
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
 * REST controller for managing {@link br.edu.up.matrix.domain.Matriz}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatrizResource {

    private final Logger log = LoggerFactory.getLogger(MatrizResource.class);

    private static final String ENTITY_NAME = "matriz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MatrizRepository matrizRepository;

    public MatrizResource(MatrizRepository matrizRepository) {
        this.matrizRepository = matrizRepository;
    }

    /**
     * {@code POST  /matrizs} : Create a new matriz.
     *
     * @param matriz the matriz to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new matriz, or with status {@code 400 (Bad Request)} if the matriz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matrizs")
    public ResponseEntity<Matriz> createMatriz(@RequestBody Matriz matriz) throws URISyntaxException {
        log.debug("REST request to save Matriz : {}", matriz);
        if (matriz.getId() != null) {
            throw new BadRequestAlertException("A new matriz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Matriz result = matrizRepository.save(matriz);
        return ResponseEntity
            .created(new URI("/api/matrizs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matrizs/:id} : Updates an existing matriz.
     *
     * @param id the id of the matriz to save.
     * @param matriz the matriz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matriz,
     * or with status {@code 400 (Bad Request)} if the matriz is not valid,
     * or with status {@code 500 (Internal Server Error)} if the matriz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matrizs/{id}")
    public ResponseEntity<Matriz> updateMatriz(@PathVariable(value = "id", required = false) final Integer id, @RequestBody Matriz matriz)
        throws URISyntaxException {
        log.debug("REST request to update Matriz : {}, {}", id, matriz);
        if (matriz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matriz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matrizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Matriz result = matrizRepository.save(matriz);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matriz.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /matrizs/:id} : Partial updates given fields of an existing matriz, field will ignore if it is null
     *
     * @param id the id of the matriz to save.
     * @param matriz the matriz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matriz,
     * or with status {@code 400 (Bad Request)} if the matriz is not valid,
     * or with status {@code 404 (Not Found)} if the matriz is not found,
     * or with status {@code 500 (Internal Server Error)} if the matriz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/matrizs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Matriz> partialUpdateMatriz(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Matriz matriz
    ) throws URISyntaxException {
        log.debug("REST request to partial update Matriz partially : {}, {}", id, matriz);
        if (matriz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matriz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matrizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Matriz> result = matrizRepository
            .findById(matriz.getId())
            .map(existingMatriz -> {
                if (matriz.getCodigo() != null) {
                    existingMatriz.setCodigo(matriz.getCodigo());
                }

                return existingMatriz;
            })
            .map(matrizRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matriz.getId().toString())
        );
    }

    /**
     * {@code GET  /matrizs} : get all the matrizs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matrizs in body.
     */
    @GetMapping("/matrizs")
    public List<Matriz> getAllMatrizs() {
        log.debug("REST request to get all Matrizs");
        return matrizRepository.findAll();
    }

    /**
     * {@code GET  /matrizs/:id} : get the "id" matriz.
     *
     * @param id the id of the matriz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the matriz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matrizs/{id}")
    public ResponseEntity<Matriz> getMatriz(@PathVariable Integer id) {
        log.debug("REST request to get Matriz : {}", id);
        Optional<Matriz> matriz = matrizRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(matriz);
    }

    /**
     * {@code DELETE  /matrizs/:id} : delete the "id" matriz.
     *
     * @param id the id of the matriz to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matrizs/{id}")
    public ResponseEntity<Void> deleteMatriz(@PathVariable Integer id) {
        log.debug("REST request to delete Matriz : {}", id);
        matrizRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
