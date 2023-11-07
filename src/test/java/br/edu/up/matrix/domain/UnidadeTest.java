package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UnidadeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Unidade.class);
        Unidade unidade1 = new Unidade();
        unidade1.setId(1);
        Unidade unidade2 = new Unidade();
        unidade2.setId(unidade1.getId());
        assertThat(unidade1).isEqualTo(unidade2);
        unidade2.setId(2);
        assertThat(unidade1).isNotEqualTo(unidade2);
        unidade1.setId(null);
        assertThat(unidade1).isNotEqualTo(unidade2);
    }
}
