package br.edu.up.matrix.web.rest;

import br.edu.up.matrix.domain.Escola;
import br.edu.up.matrix.repository.EscolaRepository;
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
 * REST controller for managing {@link br.edu.up.matrix.domain.Escola}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EscolaResource {

    private final Logger log = LoggerFactory.getLogger(EscolaResource.class);

    private static final String ENTITY_NAME = "escola";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EscolaRepository escolaRepository;

    public EscolaResource(EscolaRepository escolaRepository) {
        this.escolaRepository = escolaRepository;
    }

    /**
     * {@code POST  /escolas} : Create a new escola.
     *
     * @param escola the escola to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new escola, or with status {@code 400 (Bad Request)} if the escola has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/escolas")
    public ResponseEntity<Escola> createEscola(@RequestBody Escola escola) throws URISyntaxException {
        log.debug("REST request to save Escola : {}", escola);
        if (escola.getId() != null) {
            throw new BadRequestAlertException("A new escola cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Escola result = escolaRepository.save(escola);
        return ResponseEntity
            .created(new URI("/api/escolas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /escolas/:id} : Updates an existing escola.
     *
     * @param id the id of the escola to save.
     * @param escola the escola to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated escola,
     * or with status {@code 400 (Bad Request)} if the escola is not valid,
     * or with status {@code 500 (Internal Server Error)} if the escola couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/escolas/{id}")
    public ResponseEntity<Escola> updateEscola(@PathVariable(value = "id", required = false) final Integer id, @RequestBody Escola escola)
        throws URISyntaxException {
        log.debug("REST request to update Escola : {}, {}", id, escola);
        if (escola.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, escola.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!escolaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Escola result = escolaRepository.save(escola);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, escola.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /escolas/:id} : Partial updates given fields of an existing escola, field will ignore if it is null
     *
     * @param id the id of the escola to save.
     * @param escola the escola to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated escola,
     * or with status {@code 400 (Bad Request)} if the escola is not valid,
     * or with status {@code 404 (Not Found)} if the escola is not found,
     * or with status {@code 500 (Internal Server Error)} if the escola couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/escolas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Escola> partialUpdateEscola(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Escola escola
    ) throws URISyntaxException {
        log.debug("REST request to partial update Escola partially : {}, {}", id, escola);
        if (escola.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, escola.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!escolaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Escola> result = escolaRepository
            .findById(escola.getId())
            .map(existingEscola -> {
                if (escola.getNome() != null) {
                    existingEscola.setNome(escola.getNome());
                }

                return existingEscola;
            })
            .map(escolaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, escola.getId().toString())
        );
    }

    /**
     * {@code GET  /escolas} : get all the escolas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of escolas in body.
     */
    @GetMapping("/escolas")
    public List<Escola> getAllEscolas() {
        log.debug("REST request to get all Escolas");
        return escolaRepository.findAll();
    }

    /**
     * {@code GET  /escolas/:id} : get the "id" escola.
     *
     * @param id the id of the escola to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the escola, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/escolas/{id}")
    public ResponseEntity<Escola> getEscola(@PathVariable Integer id) {
        log.debug("REST request to get Escola : {}", id);
        Optional<Escola> escola = escolaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(escola);
    }

    /**
     * {@code DELETE  /escolas/:id} : delete the "id" escola.
     *
     * @param id the id of the escola to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/escolas/{id}")
    public ResponseEntity<Void> deleteEscola(@PathVariable Integer id) {
        log.debug("REST request to delete Escola : {}", id);
        escolaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
