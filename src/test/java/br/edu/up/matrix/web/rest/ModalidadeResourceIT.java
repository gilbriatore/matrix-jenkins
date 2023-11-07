package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Modalidade;
import br.edu.up.matrix.repository.ModalidadeRepository;
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
 * Integration tests for the {@link ModalidadeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModalidadeResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/modalidades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private ModalidadeRepository modalidadeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModalidadeMockMvc;

    private Modalidade modalidade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modalidade createEntity(EntityManager em) {
        Modalidade modalidade = new Modalidade().nome(DEFAULT_NOME);
        return modalidade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modalidade createUpdatedEntity(EntityManager em) {
        Modalidade modalidade = new Modalidade().nome(UPDATED_NOME);
        return modalidade;
    }

    @BeforeEach
    public void initTest() {
        modalidade = createEntity(em);
    }

    @Test
    @Transactional
    void createModalidade() throws Exception {
        int databaseSizeBeforeCreate = modalidadeRepository.findAll().size();
        // Create the Modalidade
        restModalidadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modalidade)))
            .andExpect(status().isCreated());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeCreate + 1);
        Modalidade testModalidade = modalidadeList.get(modalidadeList.size() - 1);
        assertThat(testModalidade.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createModalidadeWithExistingId() throws Exception {
        // Create the Modalidade with an existing ID
        modalidade.setId(1);

        int databaseSizeBeforeCreate = modalidadeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModalidadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modalidade)))
            .andExpect(status().isBadRequest());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllModalidades() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        // Get all the modalidadeList
        restModalidadeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modalidade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getModalidade() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        // Get the modalidade
        restModalidadeMockMvc
            .perform(get(ENTITY_API_URL_ID, modalidade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(modalidade.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingModalidade() throws Exception {
        // Get the modalidade
        restModalidadeMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModalidade() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();

        // Update the modalidade
        Modalidade updatedModalidade = modalidadeRepository.findById(modalidade.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedModalidade are not directly saved in db
        em.detach(updatedModalidade);
        updatedModalidade.nome(UPDATED_NOME);

        restModalidadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedModalidade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedModalidade))
            )
            .andExpect(status().isOk());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
        Modalidade testModalidade = modalidadeList.get(modalidadeList.size() - 1);
        assertThat(testModalidade.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modalidade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modalidade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modalidade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modalidade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModalidadeWithPatch() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();

        // Update the modalidade using partial update
        Modalidade partialUpdatedModalidade = new Modalidade();
        partialUpdatedModalidade.setId(modalidade.getId());

        partialUpdatedModalidade.nome(UPDATED_NOME);

        restModalidadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModalidade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModalidade))
            )
            .andExpect(status().isOk());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
        Modalidade testModalidade = modalidadeList.get(modalidadeList.size() - 1);
        assertThat(testModalidade.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void fullUpdateModalidadeWithPatch() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();

        // Update the modalidade using partial update
        Modalidade partialUpdatedModalidade = new Modalidade();
        partialUpdatedModalidade.setId(modalidade.getId());

        partialUpdatedModalidade.nome(UPDATED_NOME);

        restModalidadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModalidade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModalidade))
            )
            .andExpect(status().isOk());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
        Modalidade testModalidade = modalidadeList.get(modalidadeList.size() - 1);
        assertThat(testModalidade.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, modalidade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modalidade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modalidade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModalidade() throws Exception {
        int databaseSizeBeforeUpdate = modalidadeRepository.findAll().size();
        modalidade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModalidadeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(modalidade))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modalidade in the database
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModalidade() throws Exception {
        // Initialize the database
        modalidadeRepository.saveAndFlush(modalidade);

        int databaseSizeBeforeDelete = modalidadeRepository.findAll().size();

        // Delete the modalidade
        restModalidadeMockMvc
            .perform(delete(ENTITY_API_URL_ID, modalidade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Modalidade> modalidadeList = modalidadeRepository.findAll();
        assertThat(modalidadeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
