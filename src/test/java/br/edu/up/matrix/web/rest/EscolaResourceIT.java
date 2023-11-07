package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Escola;
import br.edu.up.matrix.repository.EscolaRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EscolaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EscolaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/escolas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private EscolaRepository escolaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEscolaMockMvc;

    private Escola escola;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Escola createEntity(EntityManager em) {
        Escola escola = new Escola().nome(DEFAULT_NOME);
        return escola;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Escola createUpdatedEntity(EntityManager em) {
        Escola escola = new Escola().nome(UPDATED_NOME);
        return escola;
    }

    @BeforeEach
    public void initTest() {
        escola = createEntity(em);
    }

    @Test
    @Transactional
    void createEscola() throws Exception {
        int databaseSizeBeforeCreate = escolaRepository.findAll().size();
        // Create the Escola
        restEscolaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(escola)))
            .andExpect(status().isCreated());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeCreate + 1);
        Escola testEscola = escolaList.get(escolaList.size() - 1);
        assertThat(testEscola.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createEscolaWithExistingId() throws Exception {
        // Create the Escola with an existing ID
        escola.setId(1);

        int databaseSizeBeforeCreate = escolaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEscolaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(escola)))
            .andExpect(status().isBadRequest());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEscolas() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        // Get all the escolaList
        restEscolaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(escola.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getEscola() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        // Get the escola
        restEscolaMockMvc
            .perform(get(ENTITY_API_URL_ID, escola.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(escola.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingEscola() throws Exception {
        // Get the escola
        restEscolaMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEscola() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();

        // Update the escola
        Escola updatedEscola = escolaRepository.findById(escola.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEscola are not directly saved in db
        em.detach(updatedEscola);
        updatedEscola.nome(UPDATED_NOME);

        restEscolaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEscola.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEscola))
            )
            .andExpect(status().isOk());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
        Escola testEscola = escolaList.get(escolaList.size() - 1);
        assertThat(testEscola.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, escola.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(escola))
            )
            .andExpect(status().isBadRequest());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(escola))
            )
            .andExpect(status().isBadRequest());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(escola)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEscolaWithPatch() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();

        // Update the escola using partial update
        Escola partialUpdatedEscola = new Escola();
        partialUpdatedEscola.setId(escola.getId());

        partialUpdatedEscola.nome(UPDATED_NOME);

        restEscolaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEscola.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEscola))
            )
            .andExpect(status().isOk());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
        Escola testEscola = escolaList.get(escolaList.size() - 1);
        assertThat(testEscola.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void fullUpdateEscolaWithPatch() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();

        // Update the escola using partial update
        Escola partialUpdatedEscola = new Escola();
        partialUpdatedEscola.setId(escola.getId());

        partialUpdatedEscola.nome(UPDATED_NOME);

        restEscolaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEscola.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEscola))
            )
            .andExpect(status().isOk());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
        Escola testEscola = escolaList.get(escolaList.size() - 1);
        assertThat(testEscola.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, escola.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(escola))
            )
            .andExpect(status().isBadRequest());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(escola))
            )
            .andExpect(status().isBadRequest());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEscola() throws Exception {
        int databaseSizeBeforeUpdate = escolaRepository.findAll().size();
        escola.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEscolaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(escola)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Escola in the database
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEscola() throws Exception {
        // Initialize the database
        escolaRepository.saveAndFlush(escola);

        int databaseSizeBeforeDelete = escolaRepository.findAll().size();

        // Delete the escola
        restEscolaMockMvc
            .perform(delete(ENTITY_API_URL_ID, escola.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Escola> escolaList = escolaRepository.findAll();
        assertThat(escolaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
