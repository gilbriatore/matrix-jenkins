package br.edu.up.matrix.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.edu.up.matrix.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BloomTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bloom.class);
        Bloom bloom1 = new Bloom();
        bloom1.setId(1);
        Bloom bloom2 = new Bloom();
        bloom2.setId(bloom1.getId());
        assertThat(bloom1).isEqualTo(bloom2);
        bloom2.setId(2);
        assertThat(bloom1).isNotEqualTo(bloom2);
        bloom1.setId(null);
        assertThat(bloom1).isNotEqualTo(bloom2);
    }
}
