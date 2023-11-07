package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.TipoDeCurso;
import br.edu.up.matrix.repository.TipoDeCursoRepository;
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
 * REST controller for managing {@link br.edu.up.matrix.domain.TipoDeCurso}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TipoDeCursoResource {

    private final Logger log = LoggerFactory.getLogger(TipoDeCursoResource.class);

    private static final String ENTITY_NAME = "tipoDeCurso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoDeCursoRepository tipoDeCursoRepository;

    public TipoDeCursoResource(TipoDeCursoRepository tipoDeCursoRepository) {
        this.tipoDeCursoRepository = tipoDeCursoRepository;
    }

    /**
     * {@code POST  /tipo-de-cursos} : Create a new tipoDeCurso.
     *
     * @param tipoDeCurso the tipoDeCurso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipoDeCurso, or with status {@code 400 (Bad Request)} if the tipoDeCurso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tipo-de-cursos")
    public ResponseEntity<TipoDeCurso> createTipoDeCurso(@RequestBody TipoDeCurso tipoDeCurso) throws URISyntaxException {
        log.debug("REST request to save TipoDeCurso : {}", tipoDeCurso);
        if (tipoDeCurso.getId() != null) {
            throw new BadRequestAlertException("A new tipoDeCurso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TipoDeCurso result = tipoDeCursoRepository.save(tipoDeCurso);
        return ResponseEntity
            .created(new URI("/api/tipo-de-cursos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tipo-de-cursos/:id} : Updates an existing tipoDeCurso.
     *
     * @param id the id of the tipoDeCurso to save.
     * @param tipoDeCurso the tipoDeCurso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoDeCurso,
     * or with status {@code 400 (Bad Request)} if the tipoDeCurso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipoDeCurso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tipo-de-cursos/{id}")
    public ResponseEntity<TipoDeCurso> updateTipoDeCurso(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody TipoDeCurso tipoDeCurso
    ) throws URISyntaxException {
        log.debug("REST request to update TipoDeCurso : {}, {}", id, tipoDeCurso);
        if (tipoDeCurso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoDeCurso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoDeCursoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TipoDeCurso result = tipoDeCursoRepository.save(tipoDeCurso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoDeCurso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tipo-de-cursos/:id} : Partial updates given fields of an existing tipoDeCurso, field will ignore if it is null
     *
     * @param id the id of the tipoDeCurso to save.
     * @param tipoDeCurso the tipoDeCurso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoDeCurso,
     * or with status {@code 400 (Bad Request)} if the tipoDeCurso is not valid,
     * or with status {@code 404 (Not Found)} if the tipoDeCurso is not found,
     * or with status {@code 500 (Internal Server Error)} if the tipoDeCurso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tipo-de-cursos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TipoDeCurso> partialUpdateTipoDeCurso(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody TipoDeCurso tipoDeCurso
    ) throws URISyntaxException {
        log.debug("REST request to partial update TipoDeCurso partially : {}, {}", id, tipoDeCurso);
        if (tipoDeCurso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoDeCurso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoDeCursoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TipoDeCurso> result = tipoDeCursoRepository
            .findById(tipoDeCurso.getId())
            .map(existingTipoDeCurso -> {
                if (tipoDeCurso.getNome() != null) {
                    existingTipoDeCurso.setNome(tipoDeCurso.getNome());
                }

                return existingTipoDeCurso;
            })
            .map(tipoDeCursoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoDeCurso.getId().toString())
        );
    }

    /**
     * {@code GET  /tipo-de-cursos} : get all the tipoDeCursos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipoDeCursos in body.
     */
    @GetMapping("/tipo-de-cursos")
    public List<TipoDeCurso> getAllTipoDeCursos() {
        log.debug("REST request to get all TipoDeCursos");
        return tipoDeCursoRepository.findAll();
    }

    /**
     * {@code GET  /tipo-de-cursos/:id} : get the "id" tipoDeCurso.
     *
     * @param id the id of the tipoDeCurso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipoDeCurso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tipo-de-cursos/{id}")
    public ResponseEntity<TipoDeCurso> getTipoDeCurso(@PathVariable Integer id) {
        log.debug("REST request to get TipoDeCurso : {}", id);
        Optional<TipoDeCurso> tipoDeCurso = tipoDeCursoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tipoDeCurso);
    }

    /**
     * {@code DELETE  /tipo-de-cursos/:id} : delete the "id" tipoDeCurso.
     *
     * @param id the id of the tipoDeCurso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tipo-de-cursos/{id}")
    public ResponseEntity<Void> deleteTipoDeCurso(@PathVariable Integer id) {
        log.debug("REST request to delete TipoDeCurso : {}", id);
        tipoDeCursoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
