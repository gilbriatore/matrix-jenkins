package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CursoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Curso.class);
        Curso curso1 = new Curso();
        curso1.setId(1);
        Curso curso2 = new Curso();
        curso2.setId(curso1.getId());
        assertThat(curso1).isEqualTo(curso2);
        curso2.setId(2);
        assertThat(curso1).isNotEqualTo(curso2);
        curso1.setId(null);
        assertThat(curso1).isNotEqualTo(curso2);
    }
}
