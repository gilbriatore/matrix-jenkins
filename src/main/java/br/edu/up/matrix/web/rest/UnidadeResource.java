package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.Unidade;
import br.edu.up.matrix.repository.UnidadeRepository;
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
 * REST controller for managing {@link br.edu.up.matrix.domain.Unidade}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UnidadeResource {

    private final Logger log = LoggerFactory.getLogger(UnidadeResource.class);

    private static final String ENTITY_NAME = "unidade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnidadeRepository unidadeRepository;

    public UnidadeResource(UnidadeRepository unidadeRepository) {
        this.unidadeRepository = unidadeRepository;
    }

    /**
     * {@code POST  /unidades} : Create a new unidade.
     *
     * @param unidade the unidade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new unidade, or with status {@code 400 (Bad Request)} if the unidade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/unidades")
    public ResponseEntity<Unidade> createUnidade(@RequestBody Unidade unidade) throws URISyntaxException {
        log.debug("REST request to save Unidade : {}", unidade);
        if (unidade.getId() != null) {
            throw new BadRequestAlertException("A new unidade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Unidade result = unidadeRepository.save(unidade);
        return ResponseEntity
            .created(new URI("/api/unidades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /unidades/:id} : Updates an existing unidade.
     *
     * @param id the id of the unidade to save.
     * @param unidade the unidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unidade,
     * or with status {@code 400 (Bad Request)} if the unidade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the unidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/unidades/{id}")
    public ResponseEntity<Unidade> updateUnidade(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Unidade unidade
    ) throws URISyntaxException {
        log.debug("REST request to update Unidade : {}, {}", id, unidade);
        if (unidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Unidade result = unidadeRepository.save(unidade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unidade.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /unidades/:id} : Partial updates given fields of an existing unidade, field will ignore if it is null
     *
     * @param id the id of the unidade to save.
     * @param unidade the unidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unidade,
     * or with status {@code 400 (Bad Request)} if the unidade is not valid,
     * or with status {@code 404 (Not Found)} if the unidade is not found,
     * or with status {@code 500 (Internal Server Error)} if the unidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/unidades/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Unidade> partialUpdateUnidade(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Unidade unidade
    ) throws URISyntaxException {
        log.debug("REST request to partial update Unidade partially : {}, {}", id, unidade);
        if (unidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Unidade> result = unidadeRepository
            .findById(unidade.getId())
            .map(existingUnidade -> {
                if (unidade.getCodigo() != null) {
                    existingUnidade.setCodigo(unidade.getCodigo());
                }

                return existingUnidade;
            })
            .map(unidadeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unidade.getId().toString())
        );
    }

    /**
     * {@code GET  /unidades} : get all the unidades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of unidades in body.
     */
    @GetMapping("/unidades")
    public List<Unidade> getAllUnidades() {
        log.debug("REST request to get all Unidades");
        return unidadeRepository.findAll();
    }

    /**
     * {@code GET  /unidades/:id} : get the "id" unidade.
     *
     * @param id the id of the unidade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the unidade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/unidades/{id}")
    public ResponseEntity<Unidade> getUnidade(@PathVariable Integer id) {
        log.debug("REST request to get Unidade : {}", id);
        Optional<Unidade> unidade = unidadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(unidade);
    }

    /**
     * {@code DELETE  /unidades/:id} : delete the "id" unidade.
     *
     * @param id the id of the unidade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/unidades/{id}")
    public ResponseEntity<Void> deleteUnidade(@PathVariable Integer id) {
        log.debug("REST request to delete Unidade : {}", id);
        unidadeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
