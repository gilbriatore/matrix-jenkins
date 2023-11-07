package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.TipoDeCurso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TipoDeCurso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoDeCursoRepository extends JpaRepository<TipoDeCurso, Integer> {}
