package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Atividade;
import br.edu.up.matrix.repository.AtividadeRepository;
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
 * Integration tests for the {@link AtividadeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AtividadeResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/atividades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private AtividadeRepository atividadeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAtividadeMockMvc;

    private Atividade atividade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Atividade createEntity(EntityManager em) {
        Atividade atividade = new Atividade().nome(DEFAULT_NOME);
        return atividade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Atividade createUpdatedEntity(EntityManager em) {
        Atividade atividade = new Atividade().nome(UPDATED_NOME);
        return atividade;
    }

    @BeforeEach
    public void initTest() {
        atividade = createEntity(em);
    }

    @Test
    @Transactional
    void createAtividade() throws Exception {
        int databaseSizeBeforeCreate = atividadeRepository.findAll().size();
        // Create the Atividade
        restAtividadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atividade)))
            .andExpect(status().isCreated());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeCreate + 1);
        Atividade testAtividade = atividadeList.get(atividadeList.size() - 1);
        assertThat(testAtividade.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createAtividadeWithExistingId() throws Exception {
        // Create the Atividade with an existing ID
        atividade.setId(1);

        int databaseSizeBeforeCreate = atividadeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAtividadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atividade)))
            .andExpect(status().isBadRequest());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAtividades() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        // Get all the atividadeList
        restAtividadeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(atividade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getAtividade() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        // Get the atividade
        restAtividadeMockMvc
            .perform(get(ENTITY_API_URL_ID, atividade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(atividade.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingAtividade() throws Exception {
        // Get the atividade
        restAtividadeMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAtividade() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();

        // Update the atividade
        Atividade updatedAtividade = atividadeRepository.findById(atividade.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAtividade are not directly saved in db
        em.detach(updatedAtividade);
        updatedAtividade.nome(UPDATED_NOME);

        restAtividadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAtividade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAtividade))
            )
            .andExpect(status().isOk());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
        Atividade testAtividade = atividadeList.get(atividadeList.size() - 1);
        assertThat(testAtividade.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, atividade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atividade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(atividade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(atividade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAtividadeWithPatch() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();

        // Update the atividade using partial update
        Atividade partialUpdatedAtividade = new Atividade();
        partialUpdatedAtividade.setId(atividade.getId());

        restAtividadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtividade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtividade))
            )
            .andExpect(status().isOk());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
        Atividade testAtividade = atividadeList.get(atividadeList.size() - 1);
        assertThat(testAtividade.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void fullUpdateAtividadeWithPatch() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();

        // Update the atividade using partial update
        Atividade partialUpdatedAtividade = new Atividade();
        partialUpdatedAtividade.setId(atividade.getId());

        partialUpdatedAtividade.nome(UPDATED_NOME);

        restAtividadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAtividade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAtividade))
            )
            .andExpect(status().isOk());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
        Atividade testAtividade = atividadeList.get(atividadeList.size() - 1);
        assertThat(testAtividade.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, atividade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atividade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(atividade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAtividade() throws Exception {
        int databaseSizeBeforeUpdate = atividadeRepository.findAll().size();
        atividade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAtividadeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(atividade))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Atividade in the database
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAtividade() throws Exception {
        // Initialize the database
        atividadeRepository.saveAndFlush(atividade);

        int databaseSizeBeforeDelete = atividadeRepository.findAll().size();

        // Delete the atividade
        restAtividadeMockMvc
            .perform(delete(ENTITY_API_URL_ID, atividade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Atividade> atividadeList = atividadeRepository.findAll();
        assertThat(atividadeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
