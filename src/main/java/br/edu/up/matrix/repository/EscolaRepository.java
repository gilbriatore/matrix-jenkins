package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Escola;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Escola entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EscolaRepository extends JpaRepository<Escola, Integer> {}
