package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AtividadeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Atividade.class);
        Atividade atividade1 = new Atividade();
        atividade1.setId(1);
        Atividade atividade2 = new Atividade();
        atividade2.setId(atividade1.getId());
        assertThat(atividade1).isEqualTo(atividade2);
        atividade2.setId(2);
        assertThat(atividade1).isNotEqualTo(atividade2);
        atividade1.setId(null);
        assertThat(atividade1).isNotEqualTo(atividade2);
    }
}
