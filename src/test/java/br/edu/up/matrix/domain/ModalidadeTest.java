package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModalidadeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Modalidade.class);
        Modalidade modalidade1 = new Modalidade();
        modalidade1.setId(1);
        Modalidade modalidade2 = new Modalidade();
        modalidade2.setId(modalidade1.getId());
        assertThat(modalidade1).isEqualTo(modalidade2);
        modalidade2.setId(2);
        assertThat(modalidade1).isNotEqualTo(modalidade2);
        modalidade1.setId(null);
        assertThat(modalidade1).isNotEqualTo(modalidade2);
    }
}
