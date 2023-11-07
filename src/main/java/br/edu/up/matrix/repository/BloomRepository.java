package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Bloom;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Bloom entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloomRepository extends JpaRepository<Bloom, Integer> {}
