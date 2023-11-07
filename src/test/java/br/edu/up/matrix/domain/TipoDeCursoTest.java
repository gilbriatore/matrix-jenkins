package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TipoDeCursoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoDeCurso.class);
        TipoDeCurso tipoDeCurso1 = new TipoDeCurso();
        tipoDeCurso1.setId(1);
        TipoDeCurso tipoDeCurso2 = new TipoDeCurso();
        tipoDeCurso2.setId(tipoDeCurso1.getId());
        assertThat(tipoDeCurso1).isEqualTo(tipoDeCurso2);
        tipoDeCurso2.setId(2);
        assertThat(tipoDeCurso1).isNotEqualTo(tipoDeCurso2);
        tipoDeCurso1.setId(null);
        assertThat(tipoDeCurso1).isNotEqualTo(tipoDeCurso2);
    }
}
