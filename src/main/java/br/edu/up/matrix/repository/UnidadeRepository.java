package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Unidade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Unidade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UnidadeRepository extends JpaRepository<Unidade, Integer> {}
