package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Matriz;
import br.edu.up.matrix.repository.MatrizRepository;
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
 * Integration tests for the {@link MatrizResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MatrizResourceIT {

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/matrizs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private MatrizRepository matrizRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatrizMockMvc;

    private Matriz matriz;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matriz createEntity(EntityManager em) {
        Matriz matriz = new Matriz().codigo(DEFAULT_CODIGO);
        return matriz;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matriz createUpdatedEntity(EntityManager em) {
        Matriz matriz = new Matriz().codigo(UPDATED_CODIGO);
        return matriz;
    }

    @BeforeEach
    public void initTest() {
        matriz = createEntity(em);
    }

    @Test
    @Transactional
    void createMatriz() throws Exception {
        int databaseSizeBeforeCreate = matrizRepository.findAll().size();
        // Create the Matriz
        restMatrizMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matriz)))
            .andExpect(status().isCreated());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeCreate + 1);
        Matriz testMatriz = matrizList.get(matrizList.size() - 1);
        assertThat(testMatriz.getCodigo()).isEqualTo(DEFAULT_CODIGO);
    }

    @Test
    @Transactional
    void createMatrizWithExistingId() throws Exception {
        // Create the Matriz with an existing ID
        matriz.setId(1);

        int databaseSizeBeforeCreate = matrizRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatrizMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matriz)))
            .andExpect(status().isBadRequest());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMatrizs() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        // Get all the matrizList
        restMatrizMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(matriz.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)));
    }

    @Test
    @Transactional
    void getMatriz() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        // Get the matriz
        restMatrizMockMvc
            .perform(get(ENTITY_API_URL_ID, matriz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(matriz.getId().intValue()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO));
    }

    @Test
    @Transactional
    void getNonExistingMatriz() throws Exception {
        // Get the matriz
        restMatrizMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMatriz() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();

        // Update the matriz
        Matriz updatedMatriz = matrizRepository.findById(matriz.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMatriz are not directly saved in db
        em.detach(updatedMatriz);
        updatedMatriz.codigo(UPDATED_CODIGO);

        restMatrizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMatriz.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMatriz))
            )
            .andExpect(status().isOk());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
        Matriz testMatriz = matrizList.get(matrizList.size() - 1);
        assertThat(testMatriz.getCodigo()).isEqualTo(UPDATED_CODIGO);
    }

    @Test
    @Transactional
    void putNonExistingMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, matriz.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(matriz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(matriz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matriz)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMatrizWithPatch() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();

        // Update the matriz using partial update
        Matriz partialUpdatedMatriz = new Matriz();
        partialUpdatedMatriz.setId(matriz.getId());

        partialUpdatedMatriz.codigo(UPDATED_CODIGO);

        restMatrizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatriz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatriz))
            )
            .andExpect(status().isOk());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
        Matriz testMatriz = matrizList.get(matrizList.size() - 1);
        assertThat(testMatriz.getCodigo()).isEqualTo(UPDATED_CODIGO);
    }

    @Test
    @Transactional
    void fullUpdateMatrizWithPatch() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();

        // Update the matriz using partial update
        Matriz partialUpdatedMatriz = new Matriz();
        partialUpdatedMatriz.setId(matriz.getId());

        partialUpdatedMatriz.codigo(UPDATED_CODIGO);

        restMatrizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatriz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatriz))
            )
            .andExpect(status().isOk());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
        Matriz testMatriz = matrizList.get(matrizList.size() - 1);
        assertThat(testMatriz.getCodigo()).isEqualTo(UPDATED_CODIGO);
    }

    @Test
    @Transactional
    void patchNonExistingMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, matriz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(matriz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(matriz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMatriz() throws Exception {
        int databaseSizeBeforeUpdate = matrizRepository.findAll().size();
        matriz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatrizMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(matriz)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matriz in the database
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMatriz() throws Exception {
        // Initialize the database
        matrizRepository.saveAndFlush(matriz);

        int databaseSizeBeforeDelete = matrizRepository.findAll().size();

        // Delete the matriz
        restMatrizMockMvc
            .perform(delete(ENTITY_API_URL_ID, matriz.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Matriz> matrizList = matrizRepository.findAll();
        assertThat(matrizList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
