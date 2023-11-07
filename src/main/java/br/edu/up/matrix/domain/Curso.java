package br.edu.up.matrix.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Curso.
 */
@Entity
@Table(name = "curso")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Curso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "carga_horas_min_curso")
    private Integer cargaHorasMinCurso;

    @Column(name = "carga_horas_min_estagio")
    private Integer cargaHorasMinEstagio;

    @Column(name = "perc_max_estagio_ac")
    private Integer percMaxEstagioAC;

    @Column(name = "perc_max_atividade_distancia")
    private Integer percMaxAtividadeDistancia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "cursos" }, allowSetters = true)
    private Escola escola;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "cursos" }, allowSetters = true)
    private TipoDeCurso tipo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getId() {
        return this.id;
    }

    public Curso id(Integer id) {
        this.setId(id);
        return this;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Curso nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getCargaHorasMinCurso() {
        return this.cargaHorasMinCurso;
    }

    public Curso cargaHorasMinCurso(Integer cargaHorasMinCurso) {
        this.setCargaHorasMinCurso(cargaHorasMinCurso);
        return this;
    }

    public void setCargaHorasMinCurso(Integer cargaHorasMinCurso) {
        this.cargaHorasMinCurso = cargaHorasMinCurso;
    }

    public Integer getCargaHorasMinEstagio() {
        return this.cargaHorasMinEstagio;
    }

    public Curso cargaHorasMinEstagio(Integer cargaHorasMinEstagio) {
        this.setCargaHorasMinEstagio(cargaHorasMinEstagio);
        return this;
    }

    public void setCargaHorasMinEstagio(Integer cargaHorasMinEstagio) {
        this.cargaHorasMinEstagio = cargaHorasMinEstagio;
    }

    public Integer getPercMaxEstagioAC() {
        return this.percMaxEstagioAC;
    }

    public Curso percMaxEstagioAC(Integer percMaxEstagioAC) {
        this.setPercMaxEstagioAC(percMaxEstagioAC);
        return this;
    }

    public void setPercMaxEstagioAC(Integer percMaxEstagioAC) {
        this.percMaxEstagioAC = percMaxEstagioAC;
    }

    public Integer getPercMaxAtividadeDistancia() {
        return this.percMaxAtividadeDistancia;
    }

    public Curso percMaxAtividadeDistancia(Integer percMaxAtividadeDistancia) {
        this.setPercMaxAtividadeDistancia(percMaxAtividadeDistancia);
        return this;
    }

    public void setPercMaxAtividadeDistancia(Integer percMaxAtividadeDistancia) {
        this.percMaxAtividadeDistancia = percMaxAtividadeDistancia;
    }

    public Escola getEscola() {
        return this.escola;
    }

    public void setEscola(Escola escola) {
        this.escola = escola;
    }

    public Curso escola(Escola escola) {
        this.setEscola(escola);
        return this;
    }

    public TipoDeCurso getTipo() {
        return this.tipo;
    }

    public void setTipo(TipoDeCurso tipoDeCurso) {
        this.tipo = tipoDeCurso;
    }

    public Curso tipo(TipoDeCurso tipoDeCurso) {
        this.setTipo(tipoDeCurso);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Curso)) {
            return false;
        }
        return getId() != null && getId().equals(((Curso) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Curso{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", cargaHorasMinCurso=" + getCargaHorasMinCurso() +
            ", cargaHorasMinEstagio=" + getCargaHorasMinEstagio() +
            ", percMaxEstagioAC=" + getPercMaxEstagioAC() +
            ", percMaxAtividadeDistancia=" + getPercMaxAtividadeDistancia() +
            "}";
    }
}
