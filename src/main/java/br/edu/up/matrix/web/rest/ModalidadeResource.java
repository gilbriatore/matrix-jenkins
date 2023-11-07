package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.Modalidade;
import br.edu.up.matrix.repository.ModalidadeRepository;
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
 * REST controller for managing {@link br.edu.up.matrix.domain.Modalidade}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ModalidadeResource {

    private final Logger log = LoggerFactory.getLogger(ModalidadeResource.class);

    private static final String ENTITY_NAME = "modalidade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModalidadeRepository modalidadeRepository;

    public ModalidadeResource(ModalidadeRepository modalidadeRepository) {
        this.modalidadeRepository = modalidadeRepository;
    }

    /**
     * {@code POST  /modalidades} : Create a new modalidade.
     *
     * @param modalidade the modalidade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new modalidade, or with status {@code 400 (Bad Request)} if the modalidade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/modalidades")
    public ResponseEntity<Modalidade> createModalidade(@RequestBody Modalidade modalidade) throws URISyntaxException {
        log.debug("REST request to save Modalidade : {}", modalidade);
        if (modalidade.getId() != null) {
            throw new BadRequestAlertException("A new modalidade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Modalidade result = modalidadeRepository.save(modalidade);
        return ResponseEntity
            .created(new URI("/api/modalidades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /modalidades/:id} : Updates an existing modalidade.
     *
     * @param id the id of the modalidade to save.
     * @param modalidade the modalidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modalidade,
     * or with status {@code 400 (Bad Request)} if the modalidade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the modalidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/modalidades/{id}")
    public ResponseEntity<Modalidade> updateModalidade(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Modalidade modalidade
    ) throws URISyntaxException {
        log.debug("REST request to update Modalidade : {}, {}", id, modalidade);
        if (modalidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modalidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!modalidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Modalidade result = modalidadeRepository.save(modalidade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modalidade.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /modalidades/:id} : Partial updates given fields of an existing modalidade, field will ignore if it is null
     *
     * @param id the id of the modalidade to save.
     * @param modalidade the modalidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modalidade,
     * or with status {@code 400 (Bad Request)} if the modalidade is not valid,
     * or with status {@code 404 (Not Found)} if the modalidade is not found,
     * or with status {@code 500 (Internal Server Error)} if the modalidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/modalidades/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Modalidade> partialUpdateModalidade(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Modalidade modalidade
    ) throws URISyntaxException {
        log.debug("REST request to partial update Modalidade partially : {}, {}", id, modalidade);
        if (modalidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modalidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!modalidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Modalidade> result = modalidadeRepository
            .findById(modalidade.getId())
            .map(existingModalidade -> {
                if (modalidade.getNome() != null) {
                    existingModalidade.setNome(modalidade.getNome());
                }

                return existingModalidade;
            })
            .map(modalidadeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modalidade.getId().toString())
        );
    }

    /**
     * {@code GET  /modalidades} : get all the modalidades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of modalidades in body.
     */
    @GetMapping("/modalidades")
    public List<Modalidade> getAllModalidades() {
        log.debug("REST request to get all Modalidades");
        return modalidadeRepository.findAll();
    }

    /**
     * {@code GET  /modalidades/:id} : get the "id" modalidade.
     *
     * @param id the id of the modalidade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the modalidade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/modalidades/{id}")
    public ResponseEntity<Modalidade> getModalidade(@PathVariable Integer id) {
        log.debug("REST request to get Modalidade : {}", id);
        Optional<Modalidade> modalidade = modalidadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(modalidade);
    }

    /**
     * {@code DELETE  /modalidades/:id} : delete the "id" modalidade.
     *
     * @param id the id of the modalidade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/modalidades/{id}")
    public ResponseEntity<Void> deleteModalidade(@PathVariable Integer id) {
        log.debug("REST request to delete Modalidade : {}", id);
        modalidadeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
