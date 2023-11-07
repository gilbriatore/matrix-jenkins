package br.edu.up.matrix.repository;

import br.edu.up.matrix.domain.Matriz;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Matriz entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatrizRepository extends JpaRepository<Matriz, Integer> {}
