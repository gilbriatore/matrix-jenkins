package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Modalidade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Modalidade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ModalidadeRepository extends JpaRepository<Modalidade, Integer> {}
