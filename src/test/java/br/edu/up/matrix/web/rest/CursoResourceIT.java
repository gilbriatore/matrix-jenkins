package br.edu.up.matrix.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.edu.up.matrix.IntegrationTest;
import br.edu.up.matrix.domain.Curso;
import br.edu.up.matrix.repository.CursoRepository;
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
 * Integration tests for the {@link CursoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CursoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final Integer DEFAULT_CARGA_HORAS_MIN_CURSO = 1;
    private static final Integer UPDATED_CARGA_HORAS_MIN_CURSO = 2;

    private static final Integer DEFAULT_CARGA_HORAS_MIN_ESTAGIO = 1;
    private static final Integer UPDATED_CARGA_HORAS_MIN_ESTAGIO = 2;

    private static final Integer DEFAULT_PERC_MAX_ESTAGIO_AC = 1;
    private static final Integer UPDATED_PERC_MAX_ESTAGIO_AC = 2;

    private static final Integer DEFAULT_PERC_MAX_ATIVIDADE_DISTANCIA = 1;
    private static final Integer UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA = 2;

    private static final String ENTITY_API_URL = "/api/cursos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger count = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCursoMockMvc;

    private Curso curso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Curso createEntity(EntityManager em) {
        Curso curso = new Curso()
            .nome(DEFAULT_NOME)
            .cargaHorasMinCurso(DEFAULT_CARGA_HORAS_MIN_CURSO)
            .cargaHorasMinEstagio(DEFAULT_CARGA_HORAS_MIN_ESTAGIO)
            .percMaxEstagioAC(DEFAULT_PERC_MAX_ESTAGIO_AC)
            .percMaxAtividadeDistancia(DEFAULT_PERC_MAX_ATIVIDADE_DISTANCIA);
        return curso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Curso createUpdatedEntity(EntityManager em) {
        Curso curso = new Curso()
            .nome(UPDATED_NOME)
            .cargaHorasMinCurso(UPDATED_CARGA_HORAS_MIN_CURSO)
            .cargaHorasMinEstagio(UPDATED_CARGA_HORAS_MIN_ESTAGIO)
            .percMaxEstagioAC(UPDATED_PERC_MAX_ESTAGIO_AC)
            .percMaxAtividadeDistancia(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);
        return curso;
    }

    @BeforeEach
    public void initTest() {
        curso = createEntity(em);
    }

    @Test
    @Transactional
    void createCurso() throws Exception {
        int databaseSizeBeforeCreate = cursoRepository.findAll().size();
        // Create the Curso
        restCursoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curso)))
            .andExpect(status().isCreated());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeCreate + 1);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testCurso.getCargaHorasMinCurso()).isEqualTo(DEFAULT_CARGA_HORAS_MIN_CURSO);
        assertThat(testCurso.getCargaHorasMinEstagio()).isEqualTo(DEFAULT_CARGA_HORAS_MIN_ESTAGIO);
        assertThat(testCurso.getPercMaxEstagioAC()).isEqualTo(DEFAULT_PERC_MAX_ESTAGIO_AC);
        assertThat(testCurso.getPercMaxAtividadeDistancia()).isEqualTo(DEFAULT_PERC_MAX_ATIVIDADE_DISTANCIA);
    }

    @Test
    @Transactional
    void createCursoWithExistingId() throws Exception {
        // Create the Curso with an existing ID
        curso.setId(1);

        int databaseSizeBeforeCreate = cursoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCursoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curso)))
            .andExpect(status().isBadRequest());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCursos() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        // Get all the cursoList
        restCursoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(curso.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cargaHorasMinCurso").value(hasItem(DEFAULT_CARGA_HORAS_MIN_CURSO)))
            .andExpect(jsonPath("$.[*].cargaHorasMinEstagio").value(hasItem(DEFAULT_CARGA_HORAS_MIN_ESTAGIO)))
            .andExpect(jsonPath("$.[*].percMaxEstagioAC").value(hasItem(DEFAULT_PERC_MAX_ESTAGIO_AC)))
            .andExpect(jsonPath("$.[*].percMaxAtividadeDistancia").value(hasItem(DEFAULT_PERC_MAX_ATIVIDADE_DISTANCIA)));
    }

    @Test
    @Transactional
    void getCurso() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        // Get the curso
        restCursoMockMvc
            .perform(get(ENTITY_API_URL_ID, curso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(curso.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cargaHorasMinCurso").value(DEFAULT_CARGA_HORAS_MIN_CURSO))
            .andExpect(jsonPath("$.cargaHorasMinEstagio").value(DEFAULT_CARGA_HORAS_MIN_ESTAGIO))
            .andExpect(jsonPath("$.percMaxEstagioAC").value(DEFAULT_PERC_MAX_ESTAGIO_AC))
            .andExpect(jsonPath("$.percMaxAtividadeDistancia").value(DEFAULT_PERC_MAX_ATIVIDADE_DISTANCIA));
    }

    @Test
    @Transactional
    void getNonExistingCurso() throws Exception {
        // Get the curso
        restCursoMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCurso() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();

        // Update the curso
        Curso updatedCurso = cursoRepository.findById(curso.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCurso are not directly saved in db
        em.detach(updatedCurso);
        updatedCurso
            .nome(UPDATED_NOME)
            .cargaHorasMinCurso(UPDATED_CARGA_HORAS_MIN_CURSO)
            .cargaHorasMinEstagio(UPDATED_CARGA_HORAS_MIN_ESTAGIO)
            .percMaxEstagioAC(UPDATED_PERC_MAX_ESTAGIO_AC)
            .percMaxAtividadeDistancia(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);

        restCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCurso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCurso))
            )
            .andExpect(status().isOk());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testCurso.getCargaHorasMinCurso()).isEqualTo(UPDATED_CARGA_HORAS_MIN_CURSO);
        assertThat(testCurso.getCargaHorasMinEstagio()).isEqualTo(UPDATED_CARGA_HORAS_MIN_ESTAGIO);
        assertThat(testCurso.getPercMaxEstagioAC()).isEqualTo(UPDATED_PERC_MAX_ESTAGIO_AC);
        assertThat(testCurso.getPercMaxAtividadeDistancia()).isEqualTo(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);
    }

    @Test
    @Transactional
    void putNonExistingCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, curso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(curso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(curso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(curso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCursoWithPatch() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();

        // Update the curso using partial update
        Curso partialUpdatedCurso = new Curso();
        partialUpdatedCurso.setId(curso.getId());

        partialUpdatedCurso
            .nome(UPDATED_NOME)
            .cargaHorasMinCurso(UPDATED_CARGA_HORAS_MIN_CURSO)
            .cargaHorasMinEstagio(UPDATED_CARGA_HORAS_MIN_ESTAGIO)
            .percMaxEstagioAC(UPDATED_PERC_MAX_ESTAGIO_AC)
            .percMaxAtividadeDistancia(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);

        restCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurso))
            )
            .andExpect(status().isOk());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testCurso.getCargaHorasMinCurso()).isEqualTo(UPDATED_CARGA_HORAS_MIN_CURSO);
        assertThat(testCurso.getCargaHorasMinEstagio()).isEqualTo(UPDATED_CARGA_HORAS_MIN_ESTAGIO);
        assertThat(testCurso.getPercMaxEstagioAC()).isEqualTo(UPDATED_PERC_MAX_ESTAGIO_AC);
        assertThat(testCurso.getPercMaxAtividadeDistancia()).isEqualTo(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);
    }

    @Test
    @Transactional
    void fullUpdateCursoWithPatch() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();

        // Update the curso using partial update
        Curso partialUpdatedCurso = new Curso();
        partialUpdatedCurso.setId(curso.getId());

        partialUpdatedCurso
            .nome(UPDATED_NOME)
            .cargaHorasMinCurso(UPDATED_CARGA_HORAS_MIN_CURSO)
            .cargaHorasMinEstagio(UPDATED_CARGA_HORAS_MIN_ESTAGIO)
            .percMaxEstagioAC(UPDATED_PERC_MAX_ESTAGIO_AC)
            .percMaxAtividadeDistancia(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);

        restCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCurso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCurso))
            )
            .andExpect(status().isOk());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
        Curso testCurso = cursoList.get(cursoList.size() - 1);
        assertThat(testCurso.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testCurso.getCargaHorasMinCurso()).isEqualTo(UPDATED_CARGA_HORAS_MIN_CURSO);
        assertThat(testCurso.getCargaHorasMinEstagio()).isEqualTo(UPDATED_CARGA_HORAS_MIN_ESTAGIO);
        assertThat(testCurso.getPercMaxEstagioAC()).isEqualTo(UPDATED_PERC_MAX_ESTAGIO_AC);
        assertThat(testCurso.getPercMaxAtividadeDistancia()).isEqualTo(UPDATED_PERC_MAX_ATIVIDADE_DISTANCIA);
    }

    @Test
    @Transactional
    void patchNonExistingCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, curso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(curso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(curso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCurso() throws Exception {
        int databaseSizeBeforeUpdate = cursoRepository.findAll().size();
        curso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCursoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(curso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Curso in the database
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCurso() throws Exception {
        // Initialize the database
        cursoRepository.saveAndFlush(curso);

        int databaseSizeBeforeDelete = cursoRepository.findAll().size();

        // Delete the curso
        restCursoMockMvc
            .perform(delete(ENTITY_API_URL_ID, curso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Curso> cursoList = cursoRepository.findAll();
        assertThat(cursoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
