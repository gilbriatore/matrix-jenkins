package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Bloom;
import br.edu.up.matrix.repository.BloomRepository;
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
 * Integration tests for the {@link BloomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BloomResourceIT {

    private static final String DEFAULT_NIVEL = "AAAAAAAAAA";
    private static final String UPDATED_NIVEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/blooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private BloomRepository bloomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBloomMockMvc;

    private Bloom bloom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloom createEntity(EntityManager em) {
        Bloom bloom = new Bloom().nivel(DEFAULT_NIVEL);
        return bloom;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloom createUpdatedEntity(EntityManager em) {
        Bloom bloom = new Bloom().nivel(UPDATED_NIVEL);
        return bloom;
    }

    @BeforeEach
    public void initTest() {
        bloom = createEntity(em);
    }

    @Test
    @Transactional
    void createBloom() throws Exception {
        int databaseSizeBeforeCreate = bloomRepository.findAll().size();
        // Create the Bloom
        restBloomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloom)))
            .andExpect(status().isCreated());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeCreate + 1);
        Bloom testBloom = bloomList.get(bloomList.size() - 1);
        assertThat(testBloom.getNivel()).isEqualTo(DEFAULT_NIVEL);
    }

    @Test
    @Transactional
    void createBloomWithExistingId() throws Exception {
        // Create the Bloom with an existing ID
        bloom.setId(1);

        int databaseSizeBeforeCreate = bloomRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloom)))
            .andExpect(status().isBadRequest());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBlooms() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        // Get all the bloomList
        restBloomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloom.getId().intValue())))
            .andExpect(jsonPath("$.[*].nivel").value(hasItem(DEFAULT_NIVEL)));
    }

    @Test
    @Transactional
    void getBloom() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        // Get the bloom
        restBloomMockMvc
            .perform(get(ENTITY_API_URL_ID, bloom.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bloom.getId().intValue()))
            .andExpect(jsonPath("$.nivel").value(DEFAULT_NIVEL));
    }

    @Test
    @Transactional
    void getNonExistingBloom() throws Exception {
        // Get the bloom
        restBloomMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBloom() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();

        // Update the bloom
        Bloom updatedBloom = bloomRepository.findById(bloom.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBloom are not directly saved in db
        em.detach(updatedBloom);
        updatedBloom.nivel(UPDATED_NIVEL);

        restBloomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBloom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBloom))
            )
            .andExpect(status().isOk());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
        Bloom testBloom = bloomList.get(bloomList.size() - 1);
        assertThat(testBloom.getNivel()).isEqualTo(UPDATED_NIVEL);
    }

    @Test
    @Transactional
    void putNonExistingBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bloom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bloom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bloom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBloomWithPatch() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();

        // Update the bloom using partial update
        Bloom partialUpdatedBloom = new Bloom();
        partialUpdatedBloom.setId(bloom.getId());

        partialUpdatedBloom.nivel(UPDATED_NIVEL);

        restBloomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBloom))
            )
            .andExpect(status().isOk());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
        Bloom testBloom = bloomList.get(bloomList.size() - 1);
        assertThat(testBloom.getNivel()).isEqualTo(UPDATED_NIVEL);
    }

    @Test
    @Transactional
    void fullUpdateBloomWithPatch() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();

        // Update the bloom using partial update
        Bloom partialUpdatedBloom = new Bloom();
        partialUpdatedBloom.setId(bloom.getId());

        partialUpdatedBloom.nivel(UPDATED_NIVEL);

        restBloomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBloom))
            )
            .andExpect(status().isOk());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
        Bloom testBloom = bloomList.get(bloomList.size() - 1);
        assertThat(testBloom.getNivel()).isEqualTo(UPDATED_NIVEL);
    }

    @Test
    @Transactional
    void patchNonExistingBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bloom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bloom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bloom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBloom() throws Exception {
        int databaseSizeBeforeUpdate = bloomRepository.findAll().size();
        bloom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloomMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bloom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bloom in the database
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBloom() throws Exception {
        // Initialize the database
        bloomRepository.saveAndFlush(bloom);

        int databaseSizeBeforeDelete = bloomRepository.findAll().size();

        // Delete the bloom
        restBloomMockMvc
            .perform(delete(ENTITY_API_URL_ID, bloom.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bloom> bloomList = bloomRepository.findAll();
        assertThat(bloomList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
