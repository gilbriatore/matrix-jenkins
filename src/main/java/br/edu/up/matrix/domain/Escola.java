package br.edu.up.matrix.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Escola.
 */
@Entity
@Table(name = "escola")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Escola implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "escola")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "escola", "tipo" }, allowSetters = true)
    private Set<Curso> cursos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getId() {
        return this.id;
    }

    public Escola id(Integer id) {
        this.setId(id);
        return this;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Escola nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Curso> getCursos() {
        return this.cursos;
    }

    public void setCursos(Set<Curso> cursos) {
        if (this.cursos != null) {
            this.cursos.forEach(i -> i.setEscola(null));
        }
        if (cursos != null) {
            cursos.forEach(i -> i.setEscola(this));
        }
        this.cursos = cursos;
    }

    public Escola cursos(Set<Curso> cursos) {
        this.setCursos(cursos);
        return this;
    }

    public Escola addCurso(Curso curso) {
        this.cursos.add(curso);
        curso.setEscola(this);
        return this;
    }

    public Escola removeCurso(Curso curso) {
        this.cursos.remove(curso);
        curso.setEscola(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Escola)) {
            return false;
        }
        return getId() != null && getId().equals(((Escola) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Escola{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
