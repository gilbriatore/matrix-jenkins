package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MatrizTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Matriz.class);
        Matriz matriz1 = new Matriz();
        matriz1.setId(1);
        Matriz matriz2 = new Matriz();
        matriz2.setId(matriz1.getId());
        assertThat(matriz1).isEqualTo(matriz2);
        matriz2.setId(2);
        assertThat(matriz1).isNotEqualTo(matriz2);
        matriz1.setId(null);
        assertThat(matriz1).isNotEqualTo(matriz2);
    }
}
