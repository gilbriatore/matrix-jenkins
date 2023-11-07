package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Atividade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Atividade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AtividadeRepository extends JpaRepository<Atividade, Integer> {}
