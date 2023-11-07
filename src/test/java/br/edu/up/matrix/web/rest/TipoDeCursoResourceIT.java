package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.TipoDeCurso;
import br.edu.up.matrix.repository.TipoDeCursoRepository;
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
 * Integration tests for the {@link TipoDeCursoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TipoDeCursoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tipo-de-cursos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private TipoDeCursoRepository tipoDeCursoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoDeCursoMockMvc;

    private TipoDeCurso tipoDeCurso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoDeCurso createEntity(EntityManager em) {
        TipoDeCurso tipoDeCurso = new TipoDeCurso().nome(DEFAULT_NOME);
        return tipoDeCurso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoDeCurso createUpdatedEntity(EntityManager em) {
        TipoDeCurso tipoDeCurso = new TipoDeCurso().nome(UPDATED_NOME);
        return tipoDeCurso;
    }

    @BeforeEach
    public void initTest() {
        tipoDeCurso = createEntity(em);
    }

    @Test
    @Transactional
    void createTipoDeCurso() throws Exception {
        int databaseSizeBeforeCreate = tipoDeCursoRepository.findAll().size();
        // Create the TipoDeCurso
        restTipoDeCursoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDeCurso)))
            .andExpect(status().isCreated());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeCreate + 1);
        TipoDeCurso testTipoDeCurso = tipoDeCursoList.get(tipoDeCursoList.size() - 1);
        assertThat(testTipoDeCurso.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createTipoDeCursoWithExistingId() throws Exception {
        // Create the TipoDeCurso with an existing ID
        tipoDeCurso.setId(1);

        int databaseSizeBeforeCreate = tipoDeCursoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoDeCursoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDeCurso)))
            .andExpect(status().isBadRequest());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTipoDeCursos() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        // Get all the tipoDeCursoList
        restTipoDeCursoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoDeCurso.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getTipoDeCurso() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        // Get the tipoDeCurso
        restTipoDeCursoMockMvc
            .perform(get(ENTITY_API_URL_ID, tipoDeCurso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipoDeCurso.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingTipoDeCurso() throws Exception {
        // Get the tipoDeCurso
        restTipoDeCursoMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTipoDeCurso() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();

        // Update the tipoDeCurso
        TipoDeCurso updatedTipoDeCurso = tipoDeCursoRepository.findById(tipoDeCurso.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTipoDeCurso are not directly saved in db
        em.detach(updatedTipoDeCurso);
        updatedTipoDeCurso.nome(UPDATED_NOME);

        restTipoDeCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTipoDeCurso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTipoDeCurso))
            )
            .andExpect(status().isOk());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
        TipoDeCurso testTipoDeCurso = tipoDeCursoList.get(tipoDeCursoList.size() - 1);
        assertThat(testTipoDeCurso.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tipoDeCurso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoDeCurso))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoDeCurso))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDeCurso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTipoDeCursoWithPatch() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();

        // Update the tipoDeCurso using partial update
        TipoDeCurso partialUpdatedTipoDeCurso = new TipoDeCurso();
        partialUpdatedTipoDeCurso.setId(tipoDeCurso.getId());

        restTipoDeCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoDeCurso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoDeCurso))
            )
            .andExpect(status().isOk());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
        TipoDeCurso testTipoDeCurso = tipoDeCursoList.get(tipoDeCursoList.size() - 1);
        assertThat(testTipoDeCurso.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void fullUpdateTipoDeCursoWithPatch() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();

        // Update the tipoDeCurso using partial update
        TipoDeCurso partialUpdatedTipoDeCurso = new TipoDeCurso();
        partialUpdatedTipoDeCurso.setId(tipoDeCurso.getId());

        partialUpdatedTipoDeCurso.nome(UPDATED_NOME);

        restTipoDeCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoDeCurso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoDeCurso))
            )
            .andExpect(status().isOk());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
        TipoDeCurso testTipoDeCurso = tipoDeCursoList.get(tipoDeCursoList.size() - 1);
        assertThat(testTipoDeCurso.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tipoDeCurso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoDeCurso))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoDeCurso))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTipoDeCurso() throws Exception {
        int databaseSizeBeforeUpdate = tipoDeCursoRepository.findAll().size();
        tipoDeCurso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDeCursoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tipoDeCurso))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoDeCurso in the database
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTipoDeCurso() throws Exception {
        // Initialize the database
        tipoDeCursoRepository.saveAndFlush(tipoDeCurso);

        int databaseSizeBeforeDelete = tipoDeCursoRepository.findAll().size();

        // Delete the tipoDeCurso
        restTipoDeCursoMockMvc
            .perform(delete(ENTITY_API_URL_ID, tipoDeCurso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TipoDeCurso> tipoDeCursoList = tipoDeCursoRepository.findAll();
        assertThat(tipoDeCursoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
